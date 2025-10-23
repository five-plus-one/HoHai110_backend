const express = require('express');
const router = express.Router();
const { getMaxims, createMaxim, likeMaxim, unlikeMaxim } = require('../controllers/maximController');
const { auth, optionalAuth } = require('../middleware/auth');

// 获取格言列表 (可选认证，用于显示是否已点赞)
router.get('/', optionalAuth, getMaxims);

// 提交新格言
router.post('/', auth, createMaxim);

// 点赞格言
router.post('/:maximId/like', auth, likeMaxim);

// 取消点赞格言
router.delete('/:maximId/like', auth, unlikeMaxim);

module.exports = router;
