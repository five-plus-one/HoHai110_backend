const { Visitor } = require('../models');
const { Op } = require('sequelize');
const crypto = require('crypto');

/**
 * 增加访客量
 * 通过sessionId来判断是否为新访客
 */
exports.addVisitor = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    // 如果没有提供sessionId，则生成一个
    const finalSessionId = sessionId || crypto.randomUUID();

    // 检查该sessionId是否已存在
    const existingVisitor = await Visitor.findOne({
      where: { sessionId: finalSessionId }
    });

    if (existingVisitor) {
      // 已经存在，不重复计数，返回当前总数
      const totalCount = await Visitor.count();
      return res.json({
        success: true,
        message: '欢迎回来',
        data: {
          isNewVisitor: false,
          sessionId: finalSessionId,
          visitorNumber: totalCount
        }
      });
    }

    // 创建新访客记录
    await Visitor.create({
      sessionId: finalSessionId,
      ipAddress,
      userAgent,
      visitTime: new Date()
    });

    // 获取总访客数
    const totalCount = await Visitor.count();

    res.status(201).json({
      success: true,
      message: '访客记录成功',
      data: {
        isNewVisitor: true,
        sessionId: finalSessionId,
        visitorNumber: totalCount
      }
    });
  } catch (error) {
    console.error('添加访客记录失败:', error);
    res.status(500).json({
      success: false,
      message: '添加访客记录失败',
      error: error.message
    });
  }
};

/**
 * 获取访客总数
 */
exports.getVisitorCount = async (req, res) => {
  try {
    const totalCount = await Visitor.count();

    res.json({
      success: true,
      data: {
        totalVisitors: totalCount
      }
    });
  } catch (error) {
    console.error('获取访客数失败:', error);
    res.status(500).json({
      success: false,
      message: '获取访客数失败',
      error: error.message
    });
  }
};

/**
 * 获取访客统计信息（管理员）
 */
exports.getVisitorStats = async (req, res) => {
  try {
    const totalCount = await Visitor.count();

    // 今日访客数
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await Visitor.count({
      where: {
        visitTime: {
          [Op.gte]: today
        }
      }
    });

    // 本周访客数
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);
    const weekCount = await Visitor.count({
      where: {
        visitTime: {
          [Op.gte]: weekAgo
        }
      }
    });

    // 本月访客数
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthCount = await Visitor.count({
      where: {
        visitTime: {
          [Op.gte]: monthStart
        }
      }
    });

    res.json({
      success: true,
      data: {
        totalVisitors: totalCount,
        todayVisitors: todayCount,
        weekVisitors: weekCount,
        monthVisitors: monthCount
      }
    });
  } catch (error) {
    console.error('获取访客统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取访客统计失败',
      error: error.message
    });
  }
};
