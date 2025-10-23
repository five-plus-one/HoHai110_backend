const { Torch } = require('../models');
const { success, error } = require('../utils/response');

// 增加火炬数量
const addTorch = async (req, res, next) => {
  try {
    const { count = 1 } = req.body;

    // 验证 count 是否为正整数
    if (!Number.isInteger(count) || count <= 0) {
      return error(res, 400, '火炬数量必须为正整数');
    }

    // 获取或创建火炬记录（假设只有一条全局记录，id=1）
    let torch = await Torch.findByPk(1);

    if (!torch) {
      torch = await Torch.create({ id: 1, count: count });
    } else {
      torch.count += count;
      await torch.save();
    }

    return success(res, {
      count: torch.count
    }, '火炬数量增加成功');
  } catch (err) {
    next(err);
  }
};

// 获取火炬数量
const getTorch = async (req, res, next) => {
  try {
    // 获取火炬记录
    let torch = await Torch.findByPk(1);

    if (!torch) {
      // 如果没有记录，创建初始记录
      torch = await Torch.create({ id: 1, count: 0 });
    }

    return success(res, {
      count: torch.count
    }, '获取火炬数量成功');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addTorch,
  getTorch
};
