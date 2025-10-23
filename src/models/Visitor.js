const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Visitor = sequelize.define('Visitor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sessionId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    comment: '会话ID，用于标识唯一访客'
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
  visitTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '访问时间'
  }
}, {
  tableName: 'visitors',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['sessionId']
    },
    {
      fields: ['visitTime']
    }
  ]
});

module.exports = Visitor;
