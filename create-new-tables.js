require('dotenv').config();
const { sequelize, Visitor, FutureMessage } = require('./src/models');

async function createNewTables() {
  try {
    console.log('开始创建新表...');
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 只同步新增的两个表
    await Visitor.sync({ force: false });
    console.log('✅ Visitor 表创建成功');

    await FutureMessage.sync({ force: false });
    console.log('✅ FutureMessage 表创建成功');

    console.log('\n🎉 新表创建完成！');
    process.exit(0);
  } catch (error) {
    console.error('创建表失败:', error);
    process.exit(1);
  }
}

createNewTables();
