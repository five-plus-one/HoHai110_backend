const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SystemConfig = sequelize.define('SystemConfig', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  key: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: '配置键名'
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '配置值（JSON格式）'
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '配置描述'
  }
}, {
  tableName: 'system_configs',
  timestamps: true
});

// 常用配置键常量
SystemConfig.KEYS = {
  REGISTRATION_ENABLED: 'registration_enabled',  // 是否允许注册
  SMTP_CONFIG: 'smtp_config'  // SMTP邮件配置
};

// 获取配置值的静态方法
SystemConfig.getConfig = async function(key, defaultValue = null) {
  try {
    const config = await this.findOne({ where: { key } });
    if (!config || config.value === null) {
      return defaultValue;
    }

    // 尝试解析JSON
    try {
      return JSON.parse(config.value);
    } catch {
      return config.value;
    }
  } catch (error) {
    console.error('获取配置失败:', error);
    return defaultValue;
  }
};

// 设置配置值的静态方法
SystemConfig.setConfig = async function(key, value, description = null) {
  try {
    const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);

    const [config, created] = await this.findOrCreate({
      where: { key },
      defaults: { key, value: valueStr, description }
    });

    if (!created) {
      await config.update({
        value: valueStr,
        ...(description && { description })
      });
    }

    return config;
  } catch (error) {
    console.error('设置配置失败:', error);
    throw error;
  }
};

module.exports = SystemConfig;
