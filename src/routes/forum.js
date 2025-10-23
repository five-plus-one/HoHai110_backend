const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { auth: authenticate, optionalAuth, isAdmin } = require('../middleware/auth');

// ==================== 板块路由 ====================

/**
 * @route   GET /api/v1/forum/forums
 * @desc    获取所有论坛板块
 * @access  Public
 */
router.get('/forums', forumController.getForums);

/**
 * @route   GET /api/v1/forum/forums/:id
 * @desc    获取单个论坛板块详情
 * @access  Public
 */
router.get('/forums/:id', forumController.getForumById);

/**
 * @route   POST /api/v1/forum/forums
 * @desc    创建论坛板块
 * @access  Admin
 */
router.post('/forums', authenticate, isAdmin, forumController.createForum);

/**
 * @route   PUT /api/v1/forum/forums/:id
 * @desc    更新论坛板块
 * @access  Admin
 */
router.put('/forums/:id', authenticate, isAdmin, forumController.updateForum);

/**
 * @route   DELETE /api/v1/forum/forums/:id
 * @desc    删除论坛板块
 * @access  Admin
 */
router.delete('/forums/:id', authenticate, isAdmin, forumController.deleteForum);

// ==================== 帖子路由 ====================

/**
 * @route   GET /api/v1/forum/posts
 * @desc    获取帖子列表
 * @access  Public
 */
router.get('/posts', forumController.getPosts);

/**
 * @route   GET /api/v1/forum/posts/:id
 * @desc    获取帖子详情
 * @access  Public (optionalAuth for like status)
 */
router.get('/posts/:id', optionalAuth, forumController.getPostById);

/**
 * @route   POST /api/v1/forum/posts
 * @desc    创建帖子
 * @access  Private
 */
router.post('/posts', authenticate, forumController.createPost);

/**
 * @route   PUT /api/v1/forum/posts/:id
 * @desc    更新帖子
 * @access  Private (Author or Admin)
 */
router.put('/posts/:id', authenticate, forumController.updatePost);

/**
 * @route   DELETE /api/v1/forum/posts/:id
 * @desc    删除帖子
 * @access  Private (Author or Admin)
 */
router.delete('/posts/:id', authenticate, forumController.deletePost);

// ==================== 回复路由 ====================

/**
 * @route   GET /api/v1/forum/posts/:postId/replies
 * @desc    获取帖子回复列表
 * @access  Public (optionalAuth for like status)
 */
router.get('/posts/:postId/replies', optionalAuth, forumController.getReplies);

/**
 * @route   POST /api/v1/forum/posts/:postId/replies
 * @desc    创建回复
 * @access  Private
 */
router.post('/posts/:postId/replies', authenticate, forumController.createReply);

/**
 * @route   DELETE /api/v1/forum/replies/:id
 * @desc    删除回复
 * @access  Private (Author or Admin)
 */
router.delete('/replies/:id', authenticate, forumController.deleteReply);

// ==================== 点赞路由 ====================

/**
 * @route   POST /api/v1/forum/:targetType/:targetId/like
 * @desc    点赞帖子或回复
 * @access  Private
 */
router.post('/:targetType/:targetId/like', authenticate, forumController.likeTarget);

/**
 * @route   DELETE /api/v1/forum/:targetType/:targetId/like
 * @desc    取消点赞
 * @access  Private
 */
router.delete('/:targetType/:targetId/like', authenticate, forumController.unlikeTarget);

// ==================== 管理员路由 ====================

/**
 * @route   PUT /api/v1/forum/posts/:id/sticky
 * @desc    置顶/取消置顶帖子
 * @access  Admin
 */
router.put('/posts/:id/sticky', authenticate, isAdmin, forumController.toggleSticky);

/**
 * @route   PUT /api/v1/forum/posts/:id/highlight
 * @desc    加精/取消加精
 * @access  Admin
 */
router.put('/posts/:id/highlight', authenticate, isAdmin, forumController.toggleHighlight);

/**
 * @route   PUT /api/v1/forum/posts/:id/lock
 * @desc    锁定/解锁帖子
 * @access  Admin
 */
router.put('/posts/:id/lock', authenticate, isAdmin, forumController.toggleLock);

/**
 * @route   PUT /api/v1/forum/posts/:id/review
 * @desc    审核帖子
 * @access  Admin
 */
router.put('/posts/:id/review', authenticate, isAdmin, forumController.reviewPost);

/**
 * @route   PUT /api/v1/forum/replies/:id/review
 * @desc    审核回复
 * @access  Admin
 */
router.put('/replies/:id/review', authenticate, isAdmin, forumController.reviewReply);

module.exports = router;
