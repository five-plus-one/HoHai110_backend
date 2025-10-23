const { User, SystemConfig } = require('../models');
const { generateToken, generateRefreshToken, verifyToken } = require('../utils/jwt');
const { success, error } = require('../utils/response');
const { validationResult } = require('express-validator');

// 用户注册
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return error(res, 400, errors.array()[0].msg);
    }

    // 检查是否允许注册
    const registrationEnabled = await SystemConfig.getConfig(
      SystemConfig.KEYS.REGISTRATION_ENABLED,
      true // 默认允许注册
    );

    if (!registrationEnabled) {
      return error(res, 403, '系统当前不允许新用户注册');
    }

    const { username, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return error(res, 400, '两次输入的密码不一致');
    }

    // Check if user exists
    const existingUser = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return error(res, 409, '该邮箱已被注册');
      }
      if (existingUser.username === username) {
        return error(res, 409, '该用户名已被使用');
      }
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password
    });

    // Generate tokens
    const token = generateToken({ userId: user.id });
    const refreshToken = generateRefreshToken({ userId: user.id });

    return success(res, {
      token,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      }
    }, '注册成功');
  } catch (err) {
    next(err);
  }
};

// 获取注册状态（公开接口）
const getRegistrationStatus = async (req, res, next) => {
  try {
    const registrationEnabled = await SystemConfig.getConfig(
      SystemConfig.KEYS.REGISTRATION_ENABLED,
      true // 默认允许注册
    );

    return success(res, {
      enabled: registrationEnabled
    }, '获取注册状态成功');
  } catch (err) {
    next(err);
  }
};

// 用户登录
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return error(res, 400, errors.array()[0].msg);
    }

    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { username },
          { email: username }
        ]
      }
    });

    if (!user) {
      return error(res, 401, '用户名或密码错误');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return error(res, 401, '用户名或密码错误');
    }

    // Generate tokens
    const token = generateToken({ userId: user.id });
    const refreshToken = generateRefreshToken({ userId: user.id });

    return success(res, {
      token,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      }
    }, '登录成功');
  } catch (err) {
    next(err);
  }
};

// Token刷新
const refresh = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 401, '未提供token');
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return error(res, 401, 'Token无效或已过期');
    }

    // Generate new tokens
    const newToken = generateToken({ userId: decoded.userId });
    const newRefreshToken = generateRefreshToken({ userId: decoded.userId });

    return success(res, {
      token: newToken,
      refreshToken: newRefreshToken
    }, 'Token刷新成功');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  refresh,
  getRegistrationStatus
};
