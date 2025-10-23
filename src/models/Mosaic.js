const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mosaic = sequelize.define('Mosaic', {
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
  thumbnailImage: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  pieceCount: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'medium'
  }
}, {
  tableName: 'mosaics',
  timestamps: true
});

module.exports = Mosaic;
