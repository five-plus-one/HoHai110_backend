const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { auth, optionalAuth } = require('../middleware/auth');
const {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
} = require('../controllers/articleController');

// 获取文章列表 (公开访问)
router.get('/', getArticles);

// 获取文章详情 (公开访问)
router.get('/:id', getArticleById);

// 创建文章 (需要登录)
router.post('/',
  auth,
  [
    body('title').notEmpty().withMessage('标题不能为空'),
    body('content').notEmpty().withMessage('内容不能为空'),
    body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('无效的状态')
  ],
  createArticle
);

// 更新文章 (需要登录)
router.put('/:id',
  auth,
  [
    body('title').optional().notEmpty().withMessage('标题不能为空'),
    body('content').optional().notEmpty().withMessage('内容不能为空'),
    body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('无效的状态')
  ],
  updateArticle
);

// 删除文章 (需要登录)
router.delete('/:id', auth, deleteArticle);

module.exports = router;
