const express = require('express');
const router = express.Router();
const { getMosaics, getMosaicById, saveProgress, completeMosaic } = require('../controllers/mosaicController');
const { auth, optionalAuth } = require('../middleware/auth');

// 获取拼图列表
router.get('/', getMosaics);

// 获取拼图详情与进度
router.get('/:mosaicId', optionalAuth, getMosaicById);

// 保存拼图进度
router.post('/:mosaicId/progress', auth, saveProgress);

// 拼图完成
router.post('/:mosaicId/complete', auth, completeMosaic);

module.exports = router;
