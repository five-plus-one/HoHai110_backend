const { User, Maxim, RelayParticipation, MosaicProgress, VerificationCode, SystemConfig } = require('../models');
const { success, error } = require('../utils/response');
const emailService = require('../utils/emailService');
const bcrypt = require('bcryptjs');

// 获取个人信息
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return error(res, 404, '用户不存在');
    }

    // Get user contributions
    const maximCount = await Maxim.count({ where: { userId } });
    const relayCount = await RelayParticipation.count({ where: { userId } });
    const mosaicCount = await MosaicProgress.count({
      where: { userId, isCompleted: true }
    });

    const joinedActivities = await RelayParticipation.count({
      where: { userId },
      distinct: true,
      col: 'activityId'
    });

    return success(res, {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      graduationYear: user.graduationYear,
      department: user.department,
      joinedActivities,
      contributions: {
        maxims: maximCount,
        relayParticipations: relayCount,
        mosaicCompleted: mosaicCount
      }
    });
  } catch (err) {
    next(err);
  }
};

// 更新个人信息
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { username, bio, avatar, graduationYear, department } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return error(res, 404, '用户不存在');
    }

    // Check if username is already taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return error(res, 409, '该用户名已被使用');
      }
      user.username = username;
    }

    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (graduationYear !== undefined) user.graduationYear = graduationYear;
    if (department !== undefined) user.department = department;

    await user.save();

    return success(res, {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      graduationYear: user.graduationYear,
      department: user.department
    }, '更新成功');
  } catch (err) {
    next(err);
  }
};

// ========== 新增用户自己编辑信息接口 ==========

// 修改密码
const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return error(res, 400, '旧密码和新密码不能为空');
    }

    if (newPassword.length < 6) {
      return error(res, 400, '新密码长度不能少于6位');
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return error(res, 404, '用户不存在');
    }

    // 验证旧密码
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return error(res, 400, '旧密码不正确');
    }

    // 更新密码
    user.password = newPassword; // 会通过hook自动加密
    await user.save();

    return success(res, null, '密码修改成功');
  } catch (err) {
    next(err);
  }
};

// 发送邮箱验证码
const sendEmailVerification = async (req, res, next) => {
  try {
    const { email, type = 'email_verification' } = req.body;

    if (!email) {
      return error(res, 400, '邮箱不能为空');
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return error(res, 400, '邮箱格式不正确');
    }

    // 检查邮箱是否已被使用（如果是更换邮箱）
    if (type === 'email_change') {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser && existingUser.id !== req.user?.id) {
        return error(res, 400, '该邮箱已被其他用户使用');
      }
    }

    // 检查是否频繁请求（1分钟内只能发送一次）
    const recentCode = await VerificationCode.findOne({
      where: {
        email,
        type,
        createdAt: {
          [require('sequelize').Op.gt]: new Date(Date.now() - 60 * 1000)
        }
      }
    });

    if (recentCode) {
      return error(res, 429, '请求过于频繁，请稍后再试');
    }

    // 创建验证码
    const ipAddress = req.ip || req.connection.remoteAddress;
    const verification = await VerificationCode.createCode(email, type, ipAddress);

    // 发送邮件
    const result = await emailService.sendVerificationCode(email, verification.code, type);

    if (!result.success) {
      return error(res, 500, '邮件发送失败: ' + result.error);
    }

    return success(res, {
      email,
      expiresIn: 900 // 15分钟
    }, '验证码已发送到您的邮箱');
  } catch (err) {
    next(err);
  }
};

// 更换邮箱
const changeEmail = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { newEmail, code } = req.body;

    if (!newEmail || !code) {
      return error(res, 400, '新邮箱和验证码不能为空');
    }

    // 检查邮箱是否已被使用
    const existingUser = await User.findOne({ where: { email: newEmail } });
    if (existingUser && existingUser.id !== userId) {
      return error(res, 400, '该邮箱已被其他用户使用');
    }

    // 验证验证码
    const verification = await VerificationCode.verifyCode(newEmail, code, 'email_change');
    if (!verification.valid) {
      return error(res, 400, verification.message);
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return error(res, 404, '用户不存在');
    }

    // 更新邮箱
    user.email = newEmail;
    await user.save();

    return success(res, {
      email: user.email
    }, '邮箱更换成功');
  } catch (err) {
    next(err);
  }
};

// 忘记密码 - 发送重置邮件
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return error(res, 400, '邮箱不能为空');
    }

    // 检查用户是否存在
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // 为了安全，不透露用户是否存在
      return success(res, null, '如果该邮箱已注册，重置链接将发送到您的邮箱');
    }

    // 检查是否频繁请求
    const recentCode = await VerificationCode.findOne({
      where: {
        email,
        type: 'password_reset',
        createdAt: {
          [require('sequelize').Op.gt]: new Date(Date.now() - 60 * 1000)
        }
      }
    });

    if (recentCode) {
      return error(res, 429, '请求过于频繁，请稍后再试');
    }

    // 创建验证码
    const ipAddress = req.ip || req.connection.remoteAddress;
    const verification = await VerificationCode.createCode(email, 'password_reset', ipAddress);

    // 发送邮件
    const result = await emailService.sendVerificationCode(email, verification.code, 'password_reset');

    if (!result.success) {
      return error(res, 500, '邮件发送失败');
    }

    return success(res, null, '如果该邮箱已注册，重置链接将发送到您的邮箱');
  } catch (err) {
    next(err);
  }
};

// 重置密码
const resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return error(res, 400, '邮箱、验证码和新密码不能为空');
    }

    if (newPassword.length < 6) {
      return error(res, 400, '新密码长度不能少于6位');
    }

    // 验证验证码
    const verification = await VerificationCode.verifyCode(email, code, 'password_reset');
    if (!verification.valid) {
      return error(res, 400, verification.message);
    }

    // 查找用户
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return error(res, 404, '用户不存在');
    }

    // 更新密码
    user.password = newPassword; // 会通过hook自动加密
    await user.save();

    return success(res, null, '密码重置成功');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  sendEmailVerification,
  changeEmail,
  forgotPassword,
  resetPassword
};
