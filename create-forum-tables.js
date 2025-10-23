require('dotenv').config();
const { sequelize, Forum, ForumPost, ForumReply, ForumLike } = require('./src/models');

async function createForumTables() {
  try {
    console.log('开始创建论坛相关表...');
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 按依赖顺序同步表
    await Forum.sync({ force: false });
    console.log('✅ forums 表创建成功');

    await ForumPost.sync({ force: false });
    console.log('✅ forum_posts 表创建成功');

    await ForumReply.sync({ force: false });
    console.log('✅ forum_replies 表创建成功');

    await ForumLike.sync({ force: false });
    console.log('✅ forum_likes 表创建成功');

    console.log('\n🎉 论坛表创建完成！');
    process.exit(0);
  } catch (error) {
    console.error('创建表失败:', error);
    process.exit(1);
  }
}

createForumTables();
