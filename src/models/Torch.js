const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Torch = sequelize.define('Torch', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  }
}, {
  tableName: 'torches',
  timestamps: true
});

module.exports = Torch;
