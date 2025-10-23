const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * 论坛点赞记录模型
 * 记录用户对帖子和回复的点赞
 */
const ForumLike = sequelize.define('ForumLike', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '点赞用户ID'
  },
  targetType: {
    type: DataTypes.ENUM('post', 'reply'),
    allowNull: false,
    comment: '点赞目标类型'
  },
  targetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '点赞目标ID'
  }
}, {
  tableName: 'forum_likes',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'targetType', 'targetId']
    },
    {
      fields: ['targetType', 'targetId']
    }
  ]
});

module.exports = ForumLike;
