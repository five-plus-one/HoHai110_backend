const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');
const { auth, isAdmin } = require('../middleware/auth');

// 公开接口 - 增加访客量
router.post('/add', visitorController.addVisitor);

// 公开接口 - 获取访客总数
router.get('/count', visitorController.getVisitorCount);

// 管理员接口 - 获取详细统计
router.get('/stats', auth, isAdmin, visitorController.getVisitorStats);

module.exports = router;
