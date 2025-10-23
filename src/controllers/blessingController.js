const { Blessing, User, sequelize } = require('../models');
const { validationResult } = require('express-validator');

// 获取祝福列表
exports.getBlessings = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status = 'approved' } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;

    const { count, rows } = await Blessing.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['createdAt', 'DESC']]
    });

    // 处理匿名祝福
    const processedRows = rows.map(blessing => {
      const blessingData = blessing.toJSON();
      if (blessingData.isAnonymous) {
        delete blessingData.user;
        blessingData.authorName = '匿名校友';
      }
      return blessingData;
    });

    res.json({
      code: 200,
      message: '获取祝福列表成功',
      data: {
        blessings: processedRows,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取单条祝福
exports.getBlessingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blessing = await Blessing.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      }]
    });

    if (!blessing) {
      return res.status(404).json({
        code: 404,
        message: '祝福不存在',
        data: null
      });
    }

    const blessingData = blessing.toJSON();
    if (blessingData.isAnonymous) {
      delete blessingData.user;
      blessingData.authorName = '匿名校友';
    }

    res.json({
      code: 200,
      message: '获取祝福成功',
      data: blessingData
    });
  } catch (error) {
    next(error);
  }
};

// 创建祝福
exports.createBlessing = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        message: '参数验证失败',
        data: errors.array()
      });
    }

    const { content, isAnonymous = false } = req.body;
    const user = await User.findByPk(req.user.id);

    const blessing = await Blessing.create({
      content,
      userId: req.user.id,
      authorName: isAnonymous ? '匿名校友' : user.username,
      graduationYear: user.graduationYear,
      department: user.department,
      isAnonymous
    });

    res.status(201).json({
      code: 201,
      message: '祝福发表成功',
      data: blessing
    });
  } catch (error) {
    next(error);
  }
};

// 更新祝福
exports.updateBlessing = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        message: '参数验证失败',
        data: errors.array()
      });
    }

    const { id } = req.params;
    const { content } = req.body;

    const blessing = await Blessing.findByPk(id);

    if (!blessing) {
      return res.status(404).json({
        code: 404,
        message: '祝福不存在',
        data: null
      });
    }

    // 检查权限
    if (blessing.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        code: 403,
        message: '无权限修改此祝福',
        data: null
      });
    }

    await blessing.update({ content });

    res.json({
      code: 200,
      message: '祝福更新成功',
      data: blessing
    });
  } catch (error) {
    next(error);
  }
};

// 删除祝福
exports.deleteBlessing = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blessing = await Blessing.findByPk(id);

    if (!blessing) {
      return res.status(404).json({
        code: 404,
        message: '祝福不存在',
        data: null
      });
    }

    // 检查权限
    if (blessing.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        code: 403,
        message: '无权限删除此祝福',
        data: null
      });
    }

    await blessing.destroy();

    res.json({
      code: 200,
      message: '祝福删除成功',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// 点赞祝福
exports.likeBlessing = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blessing = await Blessing.findByPk(id);

    if (!blessing) {
      return res.status(404).json({
        code: 404,
        message: '祝福不存在',
        data: null
      });
    }

    await blessing.increment('likes');

    res.json({
      code: 200,
      message: '点赞成功',
      data: { likes: blessing.likes + 1 }
    });
  } catch (error) {
    next(error);
  }
};

// 取消点赞祝福
exports.unlikeBlessing = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blessing = await Blessing.findByPk(id);

    if (!blessing) {
      return res.status(404).json({
        code: 404,
        message: '祝福不存在',
        data: null
      });
    }

    // 防止点赞数为负数
    if (blessing.likes > 0) {
      await blessing.decrement('likes');
    }

    res.json({
      code: 200,
      message: '取消点赞成功',
      data: { likes: Math.max(0, blessing.likes - 1) }
    });
  } catch (error) {
    next(error);
  }
};

// 获取随机祝福
exports.getRandomBlessings = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;

    const blessings = await Blessing.findAll({
      where: { status: 'approved' },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      }],
      order: sequelize.random(),
      limit: parseInt(limit)
    });

    const processedBlessings = blessings.map(blessing => {
      const blessingData = blessing.toJSON();
      if (blessingData.isAnonymous) {
        delete blessingData.user;
        blessingData.authorName = '匿名校友';
      }
      return blessingData;
    });

    res.json({
      code: 200,
      message: '获取随机祝福成功',
      data: processedBlessings
    });
  } catch (error) {
    next(error);
  }
};
