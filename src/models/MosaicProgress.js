const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MosaicProgress = sequelize.define('MosaicProgress', {
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
  mosaicId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'mosaics',
      key: 'id'
    }
  },
  completedPieces: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  progressData: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  startTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'mosaic_progress',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'mosaicId']
    }
  ]
});

module.exports = MosaicProgress;
