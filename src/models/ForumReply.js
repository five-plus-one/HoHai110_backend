const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * 论坛回复模型
 * 用户对论坛帖子的回复
 */
const ForumReply = sequelize.define('ForumReply', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '所属帖子ID'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '回复用户ID'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '回复内容'
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '图片URLs数组',
    defaultValue: []
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '父回复ID (用于楼中楼)'
  },
  replyToUserId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '被回复的用户ID'
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'approved',
    comment: '回复状态'
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '点赞数'
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '楼层号'
  }
}, {
  tableName: 'forum_replies',
  timestamps: true,
  indexes: [
    {
      fields: ['postId']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['parentId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = ForumReply;
