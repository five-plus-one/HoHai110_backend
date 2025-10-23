const express = require('express');
const router = express.Router();
const { getAlumniDistribution } = require('../controllers/mapController');

// 获取校友分布数据
router.get('/alumni-distribution', getAlumniDistribution);

module.exports = router;
