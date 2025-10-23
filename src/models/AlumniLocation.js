const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AlumniLocation = sequelize.define('AlumniLocation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  lat: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false
  },
  lng: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false
  },
  alumniCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  province: {
    type: DataTypes.STRING(50),
    defaultValue: null
  },
  country: {
    type: DataTypes.STRING(50),
    defaultValue: '中国'
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: null
  }
}, {
  tableName: 'alumni_locations',
  timestamps: true
});

module.exports = AlumniLocation;
