const { Maxim, MaximLike, User } = require('../models');
const { success, error } = require('../utils/response');
const { Op } = require('sequelize');

// 获取格言列表
const getMaxims = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, sort = 'newest' } = req.query;
    const userId = req.user ? req.user.id : null;

    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize);

    let order = [['createdAt', 'DESC']];
    if (sort === 'popular') {
      order = [['likes', 'DESC']];
    } else if (sort === 'random') {
      order = require('sequelize').literal('RAND()');
    }

    const { count, rows } = await Maxim.findAndCountAll({
      order,
      limit,
      offset,
      include: userId ? [{
        model: User,
        as: 'likedByUsers',
        where: { id: userId },
        required: false,
        attributes: [],
        through: { attributes: [] }
      }] : []
    });

    const maxims = rows.map(maxim => ({
      id: maxim.id,
      content: maxim.content,
      author: maxim.author,
      category: maxim.category,
      likes: maxim.likes,
      isLiked: userId ? maxim.likedByUsers && maxim.likedByUsers.length > 0 : false,
      createdAt: maxim.createdAt
    }));

    return success(res, {
      maxims,
      total: count,
      page: parseInt(page),
      pageSize: limit
    });
  } catch (err) {
    next(err);
  }
};

// 提交新格言
const createMaxim = async (req, res, next) => {
  try {
    const { content, author, category = '其他' } = req.body;
    const userId = req.user.id;

    if (!content || !author) {
      return error(res, 400, '格言内容和作者不能为空');
    }

    const maxim = await Maxim.create({
      userId,
      content,
      author,
      category
    });

    return success(res, {
      id: maxim.id,
      content: maxim.content,
      author: maxim.author,
      category: maxim.category,
      likes: maxim.likes,
      createdAt: maxim.createdAt
    }, '提交成功');
  } catch (err) {
    next(err);
  }
};

// 点赞格言
const likeMaxim = async (req, res, next) => {
  try {
    const { maximId } = req.params;
    const userId = req.user.id;

    // Check if maxim exists
    const maxim = await Maxim.findByPk(maximId);
    if (!maxim) {
      return error(res, 404, '格言不存在');
    }

    // Check if already liked
    const existingLike = await MaximLike.findOne({
      where: { userId, maximId }
    });

    if (existingLike) {
      return error(res, 400, '您已经点赞过该格言');
    }

    // Create like
    await MaximLike.create({ userId, maximId });

    // Increment likes count
    await maxim.increment('likes');
    await maxim.reload();

    return success(res, {
      maximId: maxim.id,
      likes: maxim.likes,
      isLiked: true
    }, '点赞成功');
  } catch (err) {
    next(err);
  }
};

// 取消点赞格言
const unlikeMaxim = async (req, res, next) => {
  try {
    const { maximId } = req.params;
    const userId = req.user.id;

    // Check if maxim exists
    const maxim = await Maxim.findByPk(maximId);
    if (!maxim) {
      return error(res, 404, '格言不存在');
    }

    // Check if liked
    const existingLike = await MaximLike.findOne({
      where: { userId, maximId }
    });

    if (!existingLike) {
      return error(res, 400, '您还未点赞该格言');
    }

    // Delete like
    await existingLike.destroy();

    // Decrement likes count
    await maxim.decrement('likes');
    await maxim.reload();

    return success(res, {
      maximId: maxim.id,
      likes: maxim.likes,
      isLiked: false
    }, '取消点赞成功');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMaxims,
  createMaxim,
  likeMaxim,
  unlikeMaxim
};
