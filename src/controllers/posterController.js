const { Poster } = require('../models');
const { success, error } = require('../utils/response');

// 获取海报列表
const getPosters = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, category } = req.query;

    const where = {};
    if (category) {
      where.category = category;
    }

    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize);

    const { count, rows } = await Poster.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    return success(res, {
      posters: rows,
      total: count,
      page: parseInt(page),
      pageSize: limit
    });
  } catch (err) {
    next(err);
  }
};

// 下载海报
const downloadPoster = async (req, res, next) => {
  try {
    const { posterId } = req.params;

    const poster = await Poster.findByPk(posterId);
    if (!poster) {
      return error(res, 404, '海报不存在');
    }

    // Increment download count
    await poster.increment('downloadCount');

    return success(res, {
      downloadUrl: poster.downloadUrl
    }, '下载记录已保存');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPosters,
  downloadPoster
};
