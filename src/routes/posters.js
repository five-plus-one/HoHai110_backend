const express = require('express');
const router = express.Router();
const { getPosters, downloadPoster } = require('../controllers/posterController');
const { optionalAuth } = require('../middleware/auth');

// 获取海报列表
router.get('/', getPosters);

// 下载海报
router.post('/:posterId/download', optionalAuth, downloadPoster);

module.exports = router;
