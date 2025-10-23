const { TimelineEvent } = require('../models');
const { success, error } = require('../utils/response');
const { Op } = require('sequelize');

// 获取时间线事件列表
const getEvents = async (req, res, next) => {
  try {
    const { year, category, page = 1, pageSize = 20 } = req.query;

    const where = {};
    if (year) {
      where.year = year;
    }
    if (category) {
      where.category = category;
    }

    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize);

    const { count, rows } = await TimelineEvent.findAndCountAll({
      where,
      order: [['year', 'ASC'], ['createdAt', 'ASC']],
      limit,
      offset
    });

    return success(res, {
      events: rows,
      total: count,
      page: parseInt(page),
      pageSize: limit
    });
  } catch (err) {
    next(err);
  }
};

// 获取单个时间线事件详情
const getEventById = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const event = await TimelineEvent.findByPk(eventId);

    if (!event) {
      return error(res, 404, '事件不存在');
    }

    return success(res, event);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getEvents,
  getEventById
};
