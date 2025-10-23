require('dotenv').config();
const { sequelize } = require('./models');

async function syncDatabase() {
  try {
    console.log('开始同步数据库...');

    // 测试连接
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 同步所有模型
    await sequelize.sync({ alter: true });
    console.log('数据库表结构同步完成');

    console.log('数据库同步成功！');
    process.exit(0);
  } catch (error) {
    console.error('数据库同步失败:', error);
    process.exit(1);
  }
}

syncDatabase();
