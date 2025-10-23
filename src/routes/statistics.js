const express = require('express');
const router = express.Router();
const { getOverview } = require('../controllers/statisticsController');

// 获取校庆统计信息
router.get('/overview', getOverview);

module.exports = router;
