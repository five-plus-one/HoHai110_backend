const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * 论坛板块模型
 * 用于组织和分类不同的讨论主题
 */
const Forum = sequelize.define('Forum', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '板块名称'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '板块描述'
  },
  icon: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: '板块图标URL'
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '排序顺序'
  },
  status: {
    type: DataTypes.ENUM('active', 'archived'),
    defaultValue: 'active',
    comment: '板块状态'
  },
  postCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '帖子总数'
  },
  replyCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '回复总数'
  }
}, {
  tableName: 'forums',
  timestamps: true,
  indexes: [
    {
      fields: ['status']
    },
    {
      fields: ['order']
    }
  ]
});

module.exports = Forum;
