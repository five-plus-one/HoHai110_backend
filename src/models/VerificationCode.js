const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VerificationCode = sequelize.define('VerificationCode', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: true
    },
    comment: '邮箱地址'
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '验证码'
  },
  type: {
    type: DataTypes.ENUM('email_verification', 'password_reset', 'email_change'),
    allowNull: false,
    comment: '验证码类型：邮箱验证、密码重置、邮箱更换'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '过期时间'
  },
  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '是否已使用'
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
    comment: '请求IP地址'
  }
}, {
  tableName: 'verification_codes',
  timestamps: true,
  indexes: [
    {
      fields: ['email', 'type', 'used']
    },
    {
      fields: ['expiresAt']
    }
  ]
});

// 生成随机验证码
VerificationCode.generateCode = function(length = 6) {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, '0');
};

// 创建验证码
VerificationCode.createCode = async function(email, type, ipAddress = null, expiryMinutes = 15) {
  const code = this.generateCode();
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

  return await this.create({
    email,
    code,
    type,
    expiresAt,
    ipAddress
  });
};

// 验证验证码
VerificationCode.verifyCode = async function(email, code, type) {
  const verification = await this.findOne({
    where: {
      email,
      code,
      type,
      used: false,
      expiresAt: {
        [require('sequelize').Op.gt]: new Date()
      }
    },
    order: [['createdAt', 'DESC']]
  });

  if (!verification) {
    return { valid: false, message: '验证码无效或已过期' };
  }

  // 标记为已使用
  await verification.update({ used: true });

  return { valid: true, verification };
};

module.exports = VerificationCode;
