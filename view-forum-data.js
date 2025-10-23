// 加载环境变量
require('dotenv').config();

const sequelize = require('./src/config/database');
const User = require('./src/models/User');
const Forum = require('./src/models/Forum');
const ForumPost = require('./src/models/ForumPost');
const ForumReply = require('./src/models/ForumReply');
const ForumLike = require('./src/models/ForumLike');

/**
 * 查看论坛数据脚本
 * 用于查看和验证论坛数据
 */

async function viewForumData() {
  try {
    console.log('📊 论坛数据统计\n');
    console.log('='.repeat(60));

    // 1. 板块统计
    console.log('\n📁 论坛板块:');
    const forums = await Forum.findAll({ order: [['order', 'ASC']] });
    forums.forEach((forum, index) => {
      console.log(`\n${index + 1}. ${forum.name} ${forum.icon}`);
      console.log(`   描述: ${forum.description}`);
      console.log(`   状态: ${forum.status} | 帖子数: ${forum.postCount} | 回复数: ${forum.replyCount}`);
    });

    // 2. 热门帖子
    console.log('\n\n🔥 热门帖子 (按浏览量排序):');
    const popularPosts = await ForumPost.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        },
        {
          model: Forum,
          as: 'forum',
          attributes: ['name']
        }
      ],
      order: [['views', 'DESC']],
      limit: 5
    });

    popularPosts.forEach((post, index) => {
      console.log(`\n${index + 1}. ${post.title}`);
      console.log(`   板块: ${post.forum.name} | 作者: ${post.user.username}`);
      console.log(`   👁️ 浏览: ${post.views} | 👍 点赞: ${post.likes} | 💬 回复: ${post.replyCount}`);
      console.log(`   ${post.isSticky ? '📌 置顶' : ''} ${post.isHighlighted ? '⭐ 精华' : ''}`);
    });

    // 3. 最新回复
    console.log('\n\n💬 最新回复:');
    const recentReplies = await ForumReply.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username']
        },
        {
          model: ForumPost,
          as: 'post',
          attributes: ['title']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    recentReplies.forEach((reply, index) => {
      console.log(`\n${index + 1}. ${reply.user.username} 回复了 "${reply.post.title.substring(0, 30)}..."`);
      console.log(`   ${reply.content.substring(0, 50)}${reply.content.length > 50 ? '...' : ''}`);
      console.log(`   👍 ${reply.likes} 点赞 | ${reply.floor ? `${reply.floor}楼` : '楼中楼'}`);
    });

    // 4. 用户统计
    console.log('\n\n👥 用户统计:');
    const users = await User.findAll({
      attributes: ['username', 'graduationYear', 'department']
    });

    console.log(`   总用户数: ${users.length}`);
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.username} - ${user.graduationYear}级 ${user.department}`);
    });

    // 5. 总体统计
    console.log('\n\n📈 总体统计:');
    const stats = {
      forums: await Forum.count(),
      posts: await ForumPost.count(),
      replies: await ForumReply.count(),
      likes: await ForumLike.count(),
      users: await User.count()
    };

    console.log(`   板块数: ${stats.forums}`);
    console.log(`   帖子数: ${stats.posts}`);
    console.log(`   回复数: ${stats.replies}`);
    console.log(`   点赞数: ${stats.likes}`);
    console.log(`   用户数: ${stats.users}`);

    console.log('\n' + '='.repeat(60));

  } catch (error) {
    console.error('❌ 查询数据时出错:', error);
    throw error;
  }
}

// 设置模型关联
Forum.hasMany(ForumPost, { foreignKey: 'forumId', as: 'posts' });
ForumPost.belongsTo(Forum, { foreignKey: 'forumId', as: 'forum' });
ForumPost.belongsTo(User, { foreignKey: 'userId', as: 'user' });
ForumPost.hasMany(ForumReply, { foreignKey: 'postId', as: 'replies' });
ForumReply.belongsTo(ForumPost, { foreignKey: 'postId', as: 'post' });
ForumReply.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(ForumPost, { foreignKey: 'userId', as: 'posts' });
User.hasMany(ForumReply, { foreignKey: 'userId', as: 'replies' });

// 运行脚本
async function main() {
  try {
    await sequelize.authenticate();
    console.log('✓ 数据库连接成功\n');

    await viewForumData();

    console.log('\n✅ 查询完成！');
    process.exit(0);
  } catch (error) {
    console.error('发生错误:', error);
    process.exit(1);
  }
}

main();
