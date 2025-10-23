const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TimelineEvent = sequelize.define('TimelineEvent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('milestone', 'achievement', 'event'),
    defaultValue: 'event'
  },
  isMajor: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  achievements: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  tableName: 'timeline_events',
  timestamps: true
});

module.exports = TimelineEvent;
