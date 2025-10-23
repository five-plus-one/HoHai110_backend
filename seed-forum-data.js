// 加载环境变量
require('dotenv').config();

const sequelize = require('./src/config/database');
const User = require('./src/models/User');
const Forum = require('./src/models/Forum');
const ForumPost = require('./src/models/ForumPost');
const ForumReply = require('./src/models/ForumReply');
const ForumLike = require('./src/models/ForumLike');

/**
 * 论坛测试数据种子脚本
 * 用于向论坛相关数据表中插入示例数据
 */

async function seedForumData() {
  try {
    console.log('开始写入论坛示例数据...\n');

    // 1. 创建或获取测试用户
    console.log('1. 创建测试用户...');
    const users = [];

    const usernames = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];

    for (let i = 0; i < usernames.length; i++) {
      const username = usernames[i];
      let user = await User.findOne({ where: { username } });

      if (!user) {
        user = await User.create({
          username: username,
          email: `user${i + 1}@hohai.edu.cn`,
          password: 'password123',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          bio: `我是${username}，河海大学的校友`,
          graduationYear: 2015 + i,
          department: ['水利工程', '港口航道与海岸工程', '土木工程', '计算机科学与技术', '环境工程', '电气工程', '机械工程', '经济学'][i],
          role: i === 0 ? 'admin' : 'user'
        });
        console.log(`   ✓ 创建用户: ${username} (${user.email})`);
      } else {
        console.log(`   - 用户已存在: ${username}`);
      }
      users.push(user);
    }
    console.log(`   共 ${users.length} 个用户\n`);

    // 2. 创建论坛板块
    console.log('2. 创建论坛板块...');
    const forumData = [
      {
        name: '校庆话题',
        description: '分享你对河海110周年校庆的感想和期待',
        icon: '🎉',
        order: 1
      },
      {
        name: '校友交流',
        description: '校友们分享工作生活、职业发展经验',
        icon: '👥',
        order: 2
      },
      {
        name: '学术讨论',
        description: '水利、土木等专业领域的学术交流',
        icon: '📚',
        order: 3
      },
      {
        name: '校园回忆',
        description: '回忆在河海的美好时光，分享老照片和故事',
        icon: '🎓',
        order: 4
      },
      {
        name: '建言献策',
        description: '为母校发展建言献策',
        icon: '💡',
        order: 5
      }
    ];

    const forums = [];
    for (const data of forumData) {
      let forum = await Forum.findOne({ where: { name: data.name } });
      if (!forum) {
        forum = await Forum.create(data);
        console.log(`   ✓ 创建板块: ${data.name}`);
      } else {
        console.log(`   - 板块已存在: ${data.name}`);
      }
      forums.push(forum);
    }
    console.log(`   共 ${forums.length} 个板块\n`);

    // 3. 创建帖子
    console.log('3. 创建论坛帖子...');
    const postsData = [
      {
        forumId: forums[0].id,
        userId: users[0].id,
        title: '河海110周年校庆，让我们一起回忆那些难忘的时光！',
        content: '今年是河海大学110周年校庆，作为2015级水利工程的学生，我在河海度过了最美好的四年时光。还记得第一次走进明远楼，第一次在图书馆通宵复习，第一次在体育场看日出...这些点点滴滴都成为了我人生中最珍贵的回忆。\n\n母校培养了我，给了我坚实的专业基础和广阔的视野。如今我已经工作多年，但河海精神一直激励着我前行。祝母校110周年生日快乐！',
        isSticky: true,
        isHighlighted: true,
        views: 1234,
        likes: 89
      },
      {
        forumId: forums[0].id,
        userId: users[1].id,
        title: '期待校庆活动！有没有一起回校参加的校友？',
        content: '看到校庆的消息特别激动，已经毕业5年了，特别想回母校看看。听说校庆期间会有很多活动，有没有校友准备回去参加的？可以一起组个团！',
        views: 567,
        likes: 45
      },
      {
        forumId: forums[1].id,
        userId: users[2].id,
        title: '水利工程专业毕业后的职业发展分享',
        content: '我是2017级水利工程专业毕业的，现在在某大型水利设计院工作。想跟学弟学妹们分享一下水利专业的就业前景和职业发展路径。\n\n1. 设计院：工作相对稳定，项目经验丰富\n2. 施工单位：能快速积累实践经验\n3. 科研院所：适合热爱研究的同学\n4. 公务员：稳定的选择\n\n欢迎大家交流讨论！',
        views: 890,
        likes: 67
      },
      {
        forumId: forums[1].id,
        userId: users[3].id,
        title: '在互联网公司工作的水利人',
        content: '虽然学的是水利，但毕业后转行做了互联网。现在在某大厂做产品经理，专注于智慧水利相关的产品。其实专业背景还是很有用的，给了我独特的视角。有没有类似经历的校友？',
        views: 456,
        likes: 34
      },
      {
        forumId: forums[2].id,
        userId: users[4].id,
        title: '关于三峡工程的一些思考',
        content: '最近在研究三峡工程的运行数据，对其防洪、发电、航运等综合效益有了更深的理解。想跟大家讨论一下大型水利枢纽工程的生态影响评估方法。',
        views: 678,
        likes: 52
      },
      {
        forumId: forums[3].id,
        userId: users[5].id,
        title: '那些年，我们一起追过的河海食堂',
        content: '还记得三食堂的红烧肉、一食堂的早餐包子、二食堂的麻辣烫...每次想起来都会流口水😋 现在在外地工作，再也吃不到那个味道了。大家最怀念食堂的哪道菜？',
        views: 999,
        likes: 123
      },
      {
        forumId: forums[3].id,
        userId: users[6].id,
        title: '还记得图书馆占座的日子吗？',
        content: '考研那段时间，每天早上6点就要去图书馆占座，晚上10点闭馆才回宿舍。虽然辛苦，但那段时光真的很充实。现在想想，那些一起奋斗的日子真的很珍贵。',
        views: 789,
        likes: 88
      },
      {
        forumId: forums[4].id,
        userId: users[7].id,
        title: '建议学校加强校友网络平台建设',
        content: '作为毕业多年的校友，我觉得学校可以建设一个更完善的校友网络平台，方便大家交流、寻找校友资源、分享职业机会等。这对于提升母校的影响力和校友凝聚力都很有帮助。',
        views: 543,
        likes: 56
      },
      {
        forumId: forums[0].id,
        userId: users[0].id,
        title: '校庆宣传片太燃了！',
        content: '刚看了学校发布的110周年校庆宣传片，真的太震撼了！从1915年河海工程专门学校的创立，到如今成为"水利特色，工科优势"的全国重点大学，母校的发展历程让人热泪盈眶。百十载河海，薪火相传！',
        views: 876,
        likes: 98
      },
      {
        forumId: forums[2].id,
        userId: users[1].id,
        title: '南水北调工程运行十周年的思考',
        content: '南水北调工程已经运行十周年了，作为水利人，想跟大家讨论一下这个世纪工程带来的影响。从技术角度看，调水量、水质保护、生态修复等方面都取得了很好的成效。',
        views: 654,
        likes: 47
      }
    ];

    const posts = [];
    for (const data of postsData) {
      const post = await ForumPost.create(data);
      posts.push(post);
      console.log(`   ✓ 创建帖子: ${data.title.substring(0, 30)}...`);
    }
    console.log(`   共 ${posts.length} 个帖子\n`);

    // 4. 创建回复
    console.log('4. 创建帖子回复...');
    const repliesData = [
      // 第一个帖子的回复
      {
        postId: posts[0].id,
        userId: users[1].id,
        content: '说得太好了！我也是河海的学生，母校给了我太多美好的回忆。祝母校生日快乐！🎉',
        floor: 1,
        likes: 23
      },
      {
        postId: posts[0].id,
        userId: users[2].id,
        content: '河海精神，代代相传！作为河海人感到非常自豪！',
        floor: 2,
        likes: 15
      },
      {
        postId: posts[0].id,
        userId: users[3].id,
        content: '明远楼前的银杏树，秋天的时候真的太美了😍',
        floor: 3,
        likes: 18
      },
      // 第二个帖子的回复
      {
        postId: posts[1].id,
        userId: users[0].id,
        content: '我也打算回去！到时候一起！',
        floor: 1,
        likes: 12
      },
      {
        postId: posts[1].id,
        userId: users[4].id,
        content: '+1，我也要回母校看看！',
        floor: 2,
        likes: 8
      },
      // 第三个帖子的回复
      {
        postId: posts[2].id,
        userId: users[0].id,
        content: '感谢分享！正好我弟弟也是水利专业的，给他看看',
        floor: 1,
        likes: 10
      },
      {
        postId: posts[2].id,
        userId: users[5].id,
        content: '我在施工单位工作，确实能学到很多东西，但是也挺辛苦的',
        floor: 2,
        likes: 14
      },
      // 第四个帖子的回复
      {
        postId: posts[3].id,
        userId: users[2].id,
        content: '转行互联网的校友越来越多了，跨界人才还是很有优势的！',
        floor: 1,
        likes: 9
      },
      // 第五个帖子的回复
      {
        postId: posts[4].id,
        userId: users[1].id,
        content: '三峡工程确实是世界级的水利工程，值得深入研究',
        floor: 1,
        likes: 11
      },
      {
        postId: posts[4].id,
        userId: users[6].id,
        content: '生态影响评估确实很重要，期待更多研究成果',
        floor: 2,
        likes: 7
      },
      // 第六个帖子的回复
      {
        postId: posts[5].id,
        userId: users[0].id,
        content: '哈哈哈，三食堂的红烧肉我也好想念！',
        floor: 1,
        likes: 20
      },
      {
        postId: posts[5].id,
        userId: users[2].id,
        content: '一食堂的包子真的绝了，早上总要排队',
        floor: 2,
        likes: 16
      },
      {
        postId: posts[5].id,
        userId: users[4].id,
        content: '还有四食堂的炒饭，分量足又好吃！',
        floor: 3,
        likes: 13
      },
      // 第七个帖子的回复
      {
        postId: posts[6].id,
        userId: users[1].id,
        content: '那段时光真的很难忘，大家一起努力的感觉特别好',
        floor: 1,
        likes: 15
      },
      {
        postId: posts[6].id,
        userId: users[3].id,
        content: '我也是考研的时候在图书馆度过的，最后成功上岸了！',
        floor: 2,
        likes: 18
      },
      // 第八个帖子的回复
      {
        postId: posts[7].id,
        userId: users[0].id,
        content: '这个建议很好！我支持！',
        floor: 1,
        likes: 12
      },
      {
        postId: posts[7].id,
        userId: users[2].id,
        content: '确实，现在很多高校都有完善的校友平台了',
        floor: 2,
        likes: 9
      },
      // 第九个帖子的回复
      {
        postId: posts[8].id,
        userId: users[3].id,
        content: '宣传片我也看了，看完真的热泪盈眶！',
        floor: 1,
        likes: 22
      },
      {
        postId: posts[8].id,
        userId: users[5].id,
        content: '百十载河海，传承不息！为母校点赞！',
        floor: 2,
        likes: 19
      },
      // 第十个帖子的回复
      {
        postId: posts[9].id,
        userId: users[0].id,
        content: '南水北调确实是造福人民的伟大工程',
        floor: 1,
        likes: 14
      }
    ];

    const replies = [];
    for (const data of repliesData) {
      const reply = await ForumReply.create(data);
      replies.push(reply);
    }
    console.log(`   ✓ 创建了 ${replies.length} 条回复\n`);

    // 5. 创建楼中楼回复（嵌套回复）
    console.log('5. 创建楼中楼回复...');
    const nestedReplies = [
      {
        postId: posts[0].id,
        userId: users[0].id,
        content: '@李四 谢谢你的祝福！一起为母校加油！',
        parentId: replies[0].id,
        replyToUserId: users[1].id,
        likes: 8
      },
      {
        postId: posts[5].id,
        userId: users[5].id,
        content: '@张三 对对对！那个红烧肉真的是一绝！',
        parentId: replies[10].id,
        replyToUserId: users[0].id,
        likes: 6
      }
    ];

    for (const data of nestedReplies) {
      await ForumReply.create(data);
    }
    console.log(`   ✓ 创建了 ${nestedReplies.length} 条楼中楼回复\n`);

    // 6. 创建点赞记录
    console.log('6. 创建点赞记录...');
    const likesData = [];

    // 为帖子创建点赞
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const likeCount = Math.min(post.likes, users.length);
      for (let j = 0; j < likeCount && j < users.length; j++) {
        likesData.push({
          userId: users[j].id,
          targetType: 'post',
          targetId: post.id
        });
      }
    }

    // 为回复创建点赞
    for (let i = 0; i < replies.length; i++) {
      const reply = replies[i];
      const likeCount = Math.min(reply.likes, users.length);
      for (let j = 0; j < likeCount && j < users.length; j++) {
        likesData.push({
          userId: users[j].id,
          targetType: 'reply',
          targetId: reply.id
        });
      }
    }

    // 批量创建点赞记录
    for (const data of likesData) {
      try {
        await ForumLike.create(data);
      } catch (error) {
        // 忽略重复的点赞记录
        if (!error.message.includes('Unique')) {
          throw error;
        }
      }
    }
    console.log(`   ✓ 创建了 ${likesData.length} 条点赞记录\n`);

    // 7. 更新统计数据
    console.log('7. 更新统计数据...');
    for (const forum of forums) {
      const postCount = await ForumPost.count({ where: { forumId: forum.id } });
      const posts = await ForumPost.findAll({
        where: { forumId: forum.id },
        attributes: ['id']
      });
      const postIds = posts.map(p => p.id);
      const replyCount = postIds.length > 0
        ? await ForumReply.count({ where: { postId: postIds } })
        : 0;

      await forum.update({ postCount, replyCount });
      console.log(`   ✓ 更新板块 "${forum.name}" 统计: ${postCount} 帖子, ${replyCount} 回复`);
    }

    for (const post of posts) {
      const replyCount = await ForumReply.count({
        where: { postId: post.id, parentId: null }
      });
      const lastReply = await ForumReply.findOne({
        where: { postId: post.id },
        order: [['createdAt', 'DESC']]
      });

      await post.update({
        replyCount,
        lastReplyAt: lastReply ? lastReply.createdAt : null,
        lastReplyUserId: lastReply ? lastReply.userId : null
      });
    }
    console.log(`   ✓ 更新帖子统计数据\n`);

    console.log('✅ 论坛示例数据写入完成！\n');
    console.log('统计信息:');
    console.log(`   - ${users.length} 个用户`);
    console.log(`   - ${forums.length} 个板块`);
    console.log(`   - ${posts.length} 个帖子`);
    console.log(`   - ${replies.length + nestedReplies.length} 条回复`);
    console.log(`   - ${likesData.length} 条点赞记录`);

  } catch (error) {
    console.error('❌ 写入数据时出错:', error);
    throw error;
  }
}

// 运行脚本
async function main() {
  try {
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('✓ 数据库连接成功\n');

    // 写入示例数据
    await seedForumData();

    console.log('\n🎉 所有操作完成！');
    process.exit(0);
  } catch (error) {
    console.error('发生错误:', error);
    process.exit(1);
  }
}

main();
