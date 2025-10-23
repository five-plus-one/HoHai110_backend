const express = require('express');
const router = express.Router();
const futureMessageController = require('../controllers/futureMessageController');
const { auth, isAdmin, optionalAuth } = require('../middleware/auth');

// 公开接口 - 创建寄语（支持未登录用户）
router.post('/', optionalAuth, futureMessageController.createMessage);

// 公开接口 - 获取寄语列表
router.get('/', futureMessageController.getMessages);

// 公开接口 - 获取随机寄语
router.get('/random', futureMessageController.getRandomMessages);

// 公开接口 - 获取单条寄语详情
router.get('/:id', futureMessageController.getMessageById);

// 管理员接口 - 获取所有寄语（包含待审核）
router.get('/admin/all', auth, isAdmin, futureMessageController.getAllMessages);

// 管理员接口 - 审核寄语
router.put('/admin/:id/review', auth, isAdmin, futureMessageController.reviewMessage);

// 管理员接口 - 删除寄语
router.delete('/admin/:id', auth, isAdmin, futureMessageController.deleteMessage);

module.exports = router;
