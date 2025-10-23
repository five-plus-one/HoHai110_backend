const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
  getComments,
  createComment,
  deleteComment,
  likeComment,
  unlikeComment
} = require('../controllers/commentController');

// 获取文章的评论列表 (公开访问)
router.get('/article/:articleId', getComments);

// 发表评论 (需要登录)
router.post('/article/:articleId',
  auth,
  [
    body('content').notEmpty().withMessage('评论内容不能为空'),
    body('parentId').optional().isInt().withMessage('父评论ID必须是整数')
  ],
  createComment
);

// 删除评论 (需要登录)
router.delete('/:id', auth, deleteComment);

// 点赞评论 (需要登录)
router.post('/:id/like', auth, likeComment);

// 取消点赞评论 (需要登录)
router.delete('/:id/like', auth, unlikeComment);

module.exports = router;
