const { Mosaic, MosaicProgress } = require('../models');
const { success, error } = require('../utils/response');

// 获取拼图列表
const getMosaics = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;

    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize);

    const { count, rows } = await Mosaic.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    return success(res, {
      mosaics: rows,
      total: count,
      page: parseInt(page),
      pageSize: limit
    });
  } catch (err) {
    next(err);
  }
};

// 获取拼图详情与进度
const getMosaicById = async (req, res, next) => {
  try {
    const { mosaicId } = req.params;
    const userId = req.user ? req.user.id : null;

    const mosaic = await Mosaic.findByPk(mosaicId);
    if (!mosaic) {
      return error(res, 404, '拼图不存在');
    }

    let userProgress = null;
    if (userId) {
      const progress = await MosaicProgress.findOne({
        where: { userId, mosaicId }
      });

      if (progress) {
        userProgress = {
          completedPieces: progress.completedPieces,
          progressPercentage: Math.round((progress.completedPieces / mosaic.pieceCount) * 100),
          startTime: progress.startTime,
          lastUpdateTime: progress.updatedAt
        };
      }
    }

    return success(res, {
      id: mosaic.id,
      title: mosaic.title,
      image: mosaic.image,
      pieceCount: mosaic.pieceCount,
      difficulty: mosaic.difficulty,
      userProgress
    });
  } catch (err) {
    next(err);
  }
};

// 保存拼图进度
const saveProgress = async (req, res, next) => {
  try {
    const { mosaicId } = req.params;
    const { completedPieces, progressData } = req.body;
    const userId = req.user.id;

    const mosaic = await Mosaic.findByPk(mosaicId);
    if (!mosaic) {
      return error(res, 404, '拼图不存在');
    }

    const [progress, created] = await MosaicProgress.findOrCreate({
      where: { userId, mosaicId },
      defaults: {
        completedPieces,
        progressData,
        startTime: new Date()
      }
    });

    if (!created) {
      progress.completedPieces = completedPieces;
      if (progressData) {
        progress.progressData = progressData;
      }
      await progress.save();
    }

    return success(res, {
      mosaicId: mosaic.id,
      completedPieces: progress.completedPieces,
      progressPercentage: Math.round((progress.completedPieces / mosaic.pieceCount) * 100),
      lastUpdateTime: progress.updatedAt
    }, '进度已保存');
  } catch (err) {
    next(err);
  }
};

// 拼图完成
const completeMosaic = async (req, res, next) => {
  try {
    const { mosaicId } = req.params;
    const userId = req.user.id;

    const mosaic = await Mosaic.findByPk(mosaicId);
    if (!mosaic) {
      return error(res, 404, '拼图不存在');
    }

    const progress = await MosaicProgress.findOne({
      where: { userId, mosaicId }
    });

    if (!progress) {
      return error(res, 400, '未找到拼图进度');
    }

    if (progress.isCompleted) {
      return error(res, 400, '该拼图已完成');
    }

    progress.isCompleted = true;
    progress.completedAt = new Date();
    progress.completedPieces = mosaic.pieceCount;
    await progress.save();

    const totalTime = Math.floor((progress.completedAt - progress.startTime) / 1000);

    return success(res, {
      mosaicId: mosaic.id,
      completedAt: progress.completedAt,
      totalTime,
      achievement: '恭喜完成拼图！'
    }, '拼图完成！');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMosaics,
  getMosaicById,
  saveProgress,
  completeMosaic
};
