const { RelayActivity, RelayParticipation, User } = require('../models');
const { success, error } = require('../utils/response');
const { Op } = require('sequelize');

// 获取接力活动列表
const getActivities = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, status } = req.query;

    const where = {};
    if (status) {
      where.status = status;
    }

    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize);

    const { count, rows } = await RelayActivity.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      include: [{
        model: RelayParticipation,
        as: 'participations',
        attributes: []
      }],
      attributes: {
        include: [
          [
            require('sequelize').fn('COUNT', require('sequelize').col('participations.id')),
            'participants'
          ]
        ]
      },
      group: ['RelayActivity.id'],
      subQuery: false
    });

    // Format response
    const activities = rows.map(activity => ({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      status: activity.status,
      startDate: activity.startDate,
      endDate: activity.endDate,
      participants: parseInt(activity.getDataValue('participants')) || 0,
      image: activity.image
    }));

    return success(res, {
      activities,
      total: count.length,
      page: parseInt(page),
      pageSize: limit
    });
  } catch (err) {
    next(err);
  }
};

// 用户参与接力活动
const participate = async (req, res, next) => {
  try {
    const { activityId, content, images = [], video } = req.body;
    const userId = req.user.id;

    // Check if activity exists
    const activity = await RelayActivity.findByPk(activityId);
    if (!activity) {
      return error(res, 404, '活动不存在');
    }

    // Check if activity is ongoing
    if (activity.status !== 'ongoing') {
      return error(res, 400, '该活动暂不接受参与');
    }

    // Create participation
    const participation = await RelayParticipation.create({
      userId,
      activityId,
      content,
      images,
      video
    });

    return success(res, {
      id: participation.id,
      userId: participation.userId,
      activityId: participation.activityId,
      content: participation.content,
      images: participation.images,
      participatedAt: participation.createdAt
    }, '参与成功');
  } catch (err) {
    next(err);
  }
};

// 获取接力活动参与者列表
const getParticipants = async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const { page = 1, pageSize = 10 } = req.query;

    // Check if activity exists
    const activity = await RelayActivity.findByPk(activityId);
    if (!activity) {
      return error(res, 404, '活动不存在');
    }

    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize);

    const { count, rows } = await RelayParticipation.findAndCountAll({
      where: { activityId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    const participants = rows.map(p => ({
      id: p.id,
      username: p.user.username,
      avatar: p.user.avatar,
      content: p.content,
      images: p.images,
      participatedAt: p.createdAt
    }));

    return success(res, {
      participants,
      total: count,
      page: parseInt(page),
      pageSize: limit
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getActivities,
  participate,
  getParticipants
};
