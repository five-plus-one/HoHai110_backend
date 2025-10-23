const { User, Article, Comment, Blessing, Maxim, RelayParticipation, SystemConfig, VerificationCode } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const emailService = require('../utils/emailService');

// 获取统计数据
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      userCount,
      articleCount,
      blessingCount,
      commentCount,
      maximCount,
      relayCount
    ] = await Promise.all([
      User.count(),
      Article.count(),
      Blessing.count(),
      Comment.count(),
      Maxim.count(),
      RelayParticipation.count()
    ]);

    res.json({
      code: 200,
      message: '获取统计数据成功',
      data: {
        users: userCount,
        articles: articleCount,
        blessings: blessingCount,
        comments: commentCount,
        maxims: maximCount,
        relayParticipations: relayCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取待审核内容
exports.getPendingContent = async (req, res, next) => {
  try {
    const [pendingComments, pendingBlessings] = await Promise.all([
      Comment.findAll({
        where: { status: 'pending' },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'avatar']
          },
          {
            model: Article,
            as: 'article',
            attributes: ['id', 'title']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: 10
      }),
      Blessing.findAll({
        where: { status: 'pending' },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatar']
        }],
        order: [['createdAt', 'DESC']],
        limit: 10
      })
    ]);

    res.json({
      code: 200,
      message: '获取待审核内容成功',
      data: {
        comments: pendingComments,
        blessings: pendingBlessings
      }
    });
  } catch (error) {
    next(error);
  }
};

// 审核评论
exports.reviewComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        code: 400,
        message: '无效的审核状态',
        data: null
      });
    }

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({
        code: 404,
        message: '评论不存在',
        data: null
      });
    }

    await comment.update({ status });

    res.json({
      code: 200,
      message: '评论审核成功',
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

// 审核祝福
exports.reviewBlessing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        code: 400,
        message: '无效的审核状态',
        data: null
      });
    }

    const blessing = await Blessing.findByPk(id);

    if (!blessing) {
      return res.status(404).json({
        code: 404,
        message: '祝福不存在',
        data: null
      });
    }

    await blessing.update({ status });

    res.json({
      code: 200,
      message: '祝福审核成功',
      data: blessing
    });
  } catch (error) {
    next(error);
  }
};

// 获取用户列表
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      code: 200,
      message: '获取用户列表成功',
      data: {
        users: rows,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// 删除用户
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        code: 400,
        message: '不能删除自己的账号',
        data: null
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在',
        data: null
      });
    }

    await user.destroy();

    res.json({
      code: 200,
      message: '用户删除成功',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// 批量删除内容
exports.batchDelete = async (req, res, next) => {
  try {
    const { type, ids } = req.body;

    if (!['comment', 'blessing', 'article'].includes(type)) {
      return res.status(400).json({
        code: 400,
        message: '无效的内容类型',
        data: null
      });
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        code: 400,
        message: '请提供要删除的ID列表',
        data: null
      });
    }

    let Model;
    switch (type) {
      case 'comment':
        Model = Comment;
        break;
      case 'blessing':
        Model = Blessing;
        break;
      case 'article':
        Model = Article;
        break;
    }

    const deleted = await Model.destroy({
      where: { id: ids }
    });

    res.json({
      code: 200,
      message: `成功删除 ${deleted} 条${type === 'comment' ? '评论' : type === 'blessing' ? '祝福' : '文章'}`,
      data: { deletedCount: deleted }
    });
  } catch (error) {
    next(error);
  }
};

// ========== 新增用户管理接口 ==========

// 修改用户角色
exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        code: 400,
        message: '无效的角色类型',
        data: null
      });
    }

    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        code: 400,
        message: '不能修改自己的角色',
        data: null
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在',
        data: null
      });
    }

    await user.update({ role });

    res.json({
      code: 200,
      message: '用户角色修改成功',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// 编辑用户信息（管理员）
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, password, avatar, bio, graduationYear, department } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在',
        data: null
      });
    }

    // 检查用户名是否已存在
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({
          code: 400,
          message: '用户名已存在',
          data: null
        });
      }
    }

    // 检查邮箱是否已存在
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({
          code: 400,
          message: '邮箱已存在',
          data: null
        });
      }
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) updateData.password = password; // 会通过hook自动加密
    if (avatar !== undefined) updateData.avatar = avatar;
    if (bio !== undefined) updateData.bio = bio;
    if (graduationYear !== undefined) updateData.graduationYear = graduationYear;
    if (department !== undefined) updateData.department = department;

    await user.update(updateData);

    res.json({
      code: 200,
      message: '用户信息更新成功',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// 批量删除用户
exports.batchDeleteUsers = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        code: 400,
        message: '请提供要删除的用户ID列表',
        data: null
      });
    }

    // 防止删除自己
    if (ids.includes(req.user.id)) {
      return res.status(400).json({
        code: 400,
        message: '不能删除自己的账号',
        data: null
      });
    }

    const deleted = await User.destroy({
      where: {
        id: ids,
        id: { [Op.ne]: req.user.id } // 额外保护，确保不删除自己
      }
    });

    res.json({
      code: 200,
      message: `成功删除 ${deleted} 个用户`,
      data: { deletedCount: deleted }
    });
  } catch (error) {
    next(error);
  }
};

// 添加用户
exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password, role = 'user', avatar, bio, graduationYear, department } = req.body;

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({
        code: 400,
        message: '用户名已存在',
        data: null
      });
    }

    // 检查邮箱是否已存在
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({
        code: 400,
        message: '邮箱已存在',
        data: null
      });
    }

    // 创建用户
    const user = await User.create({
      username,
      email,
      password, // 会通过hook自动加密
      role,
      avatar,
      bio,
      graduationYear,
      department
    });

    res.status(201).json({
      code: 201,
      message: '用户创建成功',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// ========== 系统配置管理接口 ==========

// 获取系统配置
exports.getSystemConfig = async (req, res, next) => {
  try {
    const { key } = req.params;

    const config = await SystemConfig.findOne({ where: { key } });

    if (!config) {
      return res.status(404).json({
        code: 404,
        message: '配置不存在',
        data: null
      });
    }

    // 如果是SMTP配置，不返回密码
    let value = config.value;
    try {
      value = JSON.parse(value);
      if (key === SystemConfig.KEYS.SMTP_CONFIG && value.password) {
        value.password = '******';
      }
    } catch {
      // 保持原值
    }

    res.json({
      code: 200,
      message: '获取配置成功',
      data: {
        key: config.key,
        value,
        description: config.description
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取所有系统配置
exports.getAllSystemConfigs = async (req, res, next) => {
  try {
    const configs = await SystemConfig.findAll();

    const formattedConfigs = configs.map(config => {
      let value = config.value;
      try {
        value = JSON.parse(value);
        // 隐藏SMTP密码
        if (config.key === SystemConfig.KEYS.SMTP_CONFIG && value.password) {
          value.password = '******';
        }
      } catch {
        // 保持原值
      }

      return {
        key: config.key,
        value,
        description: config.description
      };
    });

    res.json({
      code: 200,
      message: '获取配置列表成功',
      data: formattedConfigs
    });
  } catch (error) {
    next(error);
  }
};

// 设置注册开关
exports.setRegistrationEnabled = async (req, res, next) => {
  try {
    const { enabled } = req.body;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({
        code: 400,
        message: 'enabled必须是布尔值',
        data: null
      });
    }

    await SystemConfig.setConfig(
      SystemConfig.KEYS.REGISTRATION_ENABLED,
      enabled,
      '是否允许新用户注册'
    );

    res.json({
      code: 200,
      message: `用户注册已${enabled ? '开启' : '关闭'}`,
      data: { enabled }
    });
  } catch (error) {
    next(error);
  }
};

// 设置SMTP配置
exports.setSmtpConfig = async (req, res, next) => {
  try {
    const { host, port, secure, user, password, fromName } = req.body;

    if (!host || !user || !password) {
      return res.status(400).json({
        code: 400,
        message: 'host、user和password为必填项',
        data: null
      });
    }

    const smtpConfig = {
      host,
      port: port || 587,
      secure: secure || false,
      user,
      password,
      fromName: fromName || '河海大学110周年校庆'
    };

    await SystemConfig.setConfig(
      SystemConfig.KEYS.SMTP_CONFIG,
      smtpConfig,
      'SMTP邮件服务器配置'
    );

    // 测试SMTP连接
    const testResult = await emailService.testConnection();

    res.json({
      code: 200,
      message: 'SMTP配置已保存',
      data: {
        config: {
          ...smtpConfig,
          password: '******' // 隐藏密码
        },
        testResult
      }
    });
  } catch (error) {
    next(error);
  }
};

// 测试SMTP连接
exports.testSmtpConnection = async (req, res, next) => {
  try {
    const result = await emailService.testConnection();

    res.json({
      code: result.success ? 200 : 500,
      message: result.message,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
