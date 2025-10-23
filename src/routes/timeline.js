const express = require('express');
const router = express.Router();
const { getEvents, getEventById } = require('../controllers/timelineController');

// 获取时间线事件列表
router.get('/events', getEvents);

// 获取单个时间线事件详情
router.get('/events/:eventId', getEventById);

module.exports = router;
