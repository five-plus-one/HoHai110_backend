const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FutureMessage = sequelize.define('FutureMessage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '姓名'
  },
  grade: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '届别/单位，如: 2018级水利工程 或 河海校友'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '誓言内容，最多500字'
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'approved',
    comment: '审核状态'
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
    comment: 'IP地址'
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '用户代理信息'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: '用户ID（如果已登录）'
  }
}, {
  tableName: 'future_messages',
  timestamps: true,
  indexes: [
    {
      fields: ['status']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = FutureMessage;
