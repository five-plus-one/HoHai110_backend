require('dotenv').config();
const sequelize = require('./src/config/database');
const User = require('./src/models/User');

async function setUserAsAdmin() {
  try {
    // 连接数据库
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');

    // 查找 test 用户
    const user = await User.findOne({ where: { username: 'test' } });

    if (!user) {
      console.log('❌ 未找到用户名为 "test" 的用户');
      console.log('提示: 请确认用户名是否正确');
      process.exit(1);
    }

    console.log('\n当前用户信息:');
    console.log(`ID: ${user.id}`);
    console.log(`用户名: ${user.username}`);
    console.log(`邮箱: ${user.email}`);
    console.log(`当前角色: ${user.role}`);

    // 如果已经是管理员，则提示
    if (user.role === 'admin') {
      console.log('\n✅ 该用户已经是管理员了！');
    } else {
      // 更新为管理员
      await user.update({ role: 'admin' });
      console.log('\n✅ 成功将用户设置为管理员！');
      console.log(`更新后角色: ${user.role}`);
    }

    await sequelize.close();
    console.log('\n✅ 操作完成');
    process.exit(0);
  } catch (error) {
    console.error('❌ 操作失败:', error.message);
    process.exit(1);
  }
}

setUserAsAdmin();
