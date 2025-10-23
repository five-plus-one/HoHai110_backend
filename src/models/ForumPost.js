const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * 论坛帖子模型
 * 用户在论坛板块中发表的主题帖
 */
const ForumPost = sequelize.define('ForumPost', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  forumId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '所属板块ID'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '发帖用户ID'
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: '帖子标题'
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: '帖子内容'
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '图片URLs数组',
    defaultValue: []
  },
  isSticky: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '是否置顶'
  },
  isHighlighted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '是否加精'
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'locked'),
    defaultValue: 'approved',
    comment: '帖子状态'
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '浏览次数'
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '点赞数'
  },
  replyCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '回复数量'
  },
  lastReplyAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '最后回复时间'
  },
  lastReplyUserId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '最后回复用户ID'
  }
}, {
  tableName: 'forum_posts',
  timestamps: true,
  indexes: [
    {
      fields: ['forumId']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['isSticky', 'lastReplyAt']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = ForumPost;
