const express = require('express');
const router = express.Router();
const { getActivities, participate, getParticipants } = require('../controllers/relayController');
const { auth } = require('../middleware/auth');

// 获取接力活动列表
router.get('/activities', getActivities);

// 用户参与接力活动
router.post('/participate', auth, participate);

// 获取接力活动参与者列表
router.get('/activities/:activityId/participants', getParticipants);

module.exports = router;
