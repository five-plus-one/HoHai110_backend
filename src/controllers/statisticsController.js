const { User, RelayParticipation, Maxim, MosaicProgress } = require('../models');
const { success } = require('../utils/response');

// 获取校庆统计信息
const getOverview = async (req, res, next) => {
  try {
    const totalUsers = await User.count();
    const totalMaxims = await Maxim.count();
    const totalRelayParticipations = await RelayParticipation.count();
    const totalMosaicsCompleted = await MosaicProgress.count({
      where: { isCompleted: true }
    });

    // Get unique participants count
    const totalParticipants = await User.count({
      include: [{
        model: RelayParticipation,
        as: 'relayParticipations',
        required: true
      }],
      distinct: true
    });

    return success(res, {
      totalVisitors: 150000, // This should be tracked separately, placeholder for now
      totalUsers,
      totalParticipants,
      totalMaxims,
      totalRelayParticipations,
      totalMosaicsCompleted
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOverview
};
