const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MaximLike = sequelize.define('MaximLike', {
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
  maximId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'maxims',
      key: 'id'
    }
  }
}, {
  tableName: 'maxim_likes',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'maximId']
    }
  ]
});

module.exports = MaximLike;
