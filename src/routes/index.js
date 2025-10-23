const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth');
const timelineRoutes = require('./timeline');
const relayRoutes = require('./relay');
const maximRoutes = require('./maxims');
// const mapRoutes = require('./map'); // 已移除地图功能
// const posterRoutes = require('./posters'); // 已移除海报功能
// const mosaicRoutes = require('./mosaics'); // 已移除拼图功能
const userRoutes = require('./users');
const statisticsRoutes = require('./statistics');
const uploadRoutes = require('./upload');
const articleRoutes = require('./articles');
const commentRoutes = require('./comments');
const blessingRoutes = require('./blessings');
const adminRoutes = require('./admin');
const visitorRoutes = require('./visitors');
const futureMessageRoutes = require('./futureMessages');
const torchRoutes = require('./torch');
const forumRoutes = require('./forum');

// Mount routes
router.use('/auth', authRoutes);
router.use('/timeline', timelineRoutes);
router.use('/relay', relayRoutes);
router.use('/maxims', maximRoutes);
// router.use('/map', mapRoutes); // 已移除地图功能
// router.use('/posters', posterRoutes); // 已移除海报功能
// router.use('/mosaics', mosaicRoutes); // 已移除拼图功能
router.use('/users', userRoutes);
router.use('/statistics', statisticsRoutes);
router.use('/upload', uploadRoutes);
router.use('/articles', articleRoutes);
router.use('/comments', commentRoutes);
router.use('/blessings', blessingRoutes);
router.use('/admin', adminRoutes);
router.use('/visitors', visitorRoutes);
router.use('/future-messages', futureMessageRoutes);
router.use('/torch', torchRoutes);
router.use('/forum', forumRoutes);

module.exports = router;
