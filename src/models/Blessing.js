const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Blessing = sequelize.define('Blessing', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  authorName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  graduationYear: {
    type: DataTypes.INTEGER,
    defaultValue: null
  },
  department: {
    type: DataTypes.STRING(100),
    defaultValue: null
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'approved'
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isAnonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'blessings',
  timestamps: true
});

module.exports = Blessing;
