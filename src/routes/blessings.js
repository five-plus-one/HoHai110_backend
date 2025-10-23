const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
  getBlessings,
  getBlessingById,
  createBlessing,
  updateBlessing,
  deleteBlessing,
  likeBlessing,
  unlikeBlessing,
  getRandomBlessings
} = require('../controllers/blessingController');

// 获取祝福列表 (公开访问)
router.get('/', getBlessings);

// 获取随机祝福 (公开访问)
router.get('/random', getRandomBlessings);

// 获取单条祝福 (公开访问)
router.get('/:id', getBlessingById);

// 发表祝福 (需要登录)
router.post('/',
  auth,
  [
    body('content').notEmpty().withMessage('祝福内容不能为空'),
    body('isAnonymous').optional().isBoolean().withMessage('匿名标识必须是布尔值')
  ],
  createBlessing
);

// 更新祝福 (需要登录)
router.put('/:id',
  auth,
  [
    body('content').notEmpty().withMessage('祝福内容不能为空')
  ],
  updateBlessing
);

// 删除祝福 (需要登录)
router.delete('/:id', auth, deleteBlessing);

// 点赞祝福 (需要登录)
router.post('/:id/like', auth, likeBlessing);

// 取消点赞祝福 (需要登录)
router.delete('/:id/like', auth, unlikeBlessing);

module.exports = router;
