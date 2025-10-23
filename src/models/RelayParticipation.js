const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RelayParticipation = sequelize.define('RelayParticipation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  activityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'relay_activities',
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  video: {
    type: DataTypes.STRING(255),
    defaultValue: null
  }
}, {
  tableName: 'relay_participations',
  timestamps: true
});

module.exports = RelayParticipation;
