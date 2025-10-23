const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Poster = sequelize.define('Poster', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  downloadUrl: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(50),
    defaultValue: null
  },
  downloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'posters',
  timestamps: true
});

module.exports = Poster;
