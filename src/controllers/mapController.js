const { AlumniLocation } = require('../models');
const { success, error } = require('../utils/response');

// 获取校友分布数据
const getAlumniDistribution = async (req, res, next) => {
  try {
    const { province, country } = req.query;

    const where = {};
    if (province) {
      where.province = province;
    }
    if (country) {
      where.country = country;
    }

    const locations = await AlumniLocation.findAll({
      where,
      order: [['alumniCount', 'DESC']]
    });

    return success(res, {
      locations,
      total: locations.length
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAlumniDistribution
};
