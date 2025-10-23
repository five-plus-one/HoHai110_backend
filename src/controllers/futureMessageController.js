const { FutureMessage, User, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * 创建寄语未来留言（无需登录）
 */
exports.createMessage = async (req, res) => {
  try {
    const { name, grade, message } = req.body;

    // 验证必填字段
    if (!name || !grade || !message) {
      return res.status(400).json({
        success: false,
        message: '姓名、届别/单位和誓言内容为必填项'
      });
    }

    // 验证内容长度
    if (message.length > 500) {
      return res.status(400).json({
        success: false,
        message: '誓言内容不能超过500字'
      });
    }

    // 获取IP和User Agent
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    // 获取用户ID（如果已登录）
    const userId = req.user ? req.user.id : null;

    // 创建留言
    const futureMessage = await FutureMessage.create({
      name,
      grade,
      message,
      ipAddress,
      userAgent,
      userId,
      status: 'approved' // 默认直接通过，如需审核可改为 'pending'
    });

    res.status(201).json({
      success: true,
      message: '您的誓言已成功点亮星火！',
      data: {
        id: futureMessage.id,
        name: futureMessage.name,
        grade: futureMessage.grade,
        message: futureMessage.message,
        createdAt: futureMessage.createdAt
      }
    });
  } catch (error) {
    console.error('创建寄语失败:', error);
    res.status(500).json({
      success: false,
      message: '创建寄语失败',
      error: error.message
    });
  }
};

/**
 * 获取寄语列表（公开接口）
 */
exports.getMessages = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = 'latest' // latest: 最新, random: 随机
    } = req.query;

    const offset = (page - 1) * limit;

    // 构建查询条件
    const where = {
      status: 'approved' // 只显示已审核通过的
    };

    let order = [['createdAt', 'DESC']]; // 默认按时间倒序

    // 随机排序
    if (sort === 'random') {
      order = sequelize.random();
    }

    const { count, rows } = await FutureMessage.findAndCountAll({
      where,
      order,
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: ['id', 'name', 'grade', 'message', 'createdAt']
    });

    res.json({
      success: true,
      data: {
        messages: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取寄语列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取寄语列表失败',
      error: error.message
    });
  }
};

/**
 * 获取随机寄语（公开接口）
 */
exports.getRandomMessages = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const messages = await FutureMessage.findAll({
      where: {
        status: 'approved'
      },
      order: sequelize.random(),
      limit: parseInt(limit),
      attributes: ['id', 'name', 'grade', 'message', 'createdAt']
    });

    res.json({
      success: true,
      data: {
        messages
      }
    });
  } catch (error) {
    console.error('获取随机寄语失败:', error);
    res.status(500).json({
      success: false,
      message: '获取随机寄语失败',
      error: error.message
    });
  }
};

/**
 * 获取寄语详情（公开接口）
 */
exports.getMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await FutureMessage.findOne({
      where: {
        id,
        status: 'approved'
      },
      attributes: ['id', 'name', 'grade', 'message', 'createdAt']
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: '寄语不存在或未通过审核'
      });
    }

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('获取寄语详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取寄语详情失败',
      error: error.message
    });
  }
};

/**
 * 删除寄语（管理员）
 */
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await FutureMessage.findByPk(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: '寄语不存在'
      });
    }

    await message.destroy();

    res.json({
      success: true,
      message: '寄语删除成功'
    });
  } catch (error) {
    console.error('删除寄语失败:', error);
    res.status(500).json({
      success: false,
      message: '删除寄语失败',
      error: error.message
    });
  }
};

/**
 * 获取所有寄语（管理员，包含待审核）
 */
exports.getAllMessages = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status // pending, approved, rejected
    } = req.query;

    const offset = (page - 1) * limit;

    // 构建查询条件
    const where = {};
    if (status) {
      where.status = status;
    }

    const { count, rows } = await FutureMessage.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
          required: false
        }
      ]
    });

    res.json({
      success: true,
      data: {
        messages: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取所有寄语失败:', error);
    res.status(500).json({
      success: false,
      message: '获取所有寄语失败',
      error: error.message
    });
  }
};

/**
 * 审核寄语（管理员）
 */
exports.reviewMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // approved 或 rejected

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: '无效的审核状态'
      });
    }

    const message = await FutureMessage.findByPk(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: '寄语不存在'
      });
    }

    message.status = status;
    await message.save();

    res.json({
      success: true,
      message: '审核成功',
      data: message
    });
  } catch (error) {
    console.error('审核寄语失败:', error);
    res.status(500).json({
      success: false,
      message: '审核寄语失败',
      error: error.message
    });
  }
};
