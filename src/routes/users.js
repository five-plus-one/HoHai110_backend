const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getProfile,
  updateProfile,
  changePassword,
  sendEmailVerification,
  changeEmail,
  forgotPassword,
  resetPassword
} = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// ========== 用户个人信息 ==========

// 获取个人信息
router.get('/profile', auth, getProfile);

// 更新个人信息
router.put('/profile', auth, updateProfile);

// 修改密码
router.put('/password',
  auth,
  [
    body('oldPassword').notEmpty().withMessage('旧密码不能为空'),
    body('newPassword').isLength({ min: 6 }).withMessage('新密码至少6位')
  ],
  changePassword
);

// ========== 邮箱相关 ==========

// 发送邮箱验证码（需登录）
router.post('/email/send-code',
  auth,
  [
    body('email').isEmail().withMessage('邮箱格式不正确'),
    body('type').optional().isIn(['email_verification', 'email_change']).withMessage('无效的验证码类型')
  ],
  sendEmailVerification
);

// 更换邮箱
router.put('/email',
  auth,
  [
    body('newEmail').isEmail().withMessage('新邮箱格式不正确'),
    body('code').notEmpty().withMessage('验证码不能为空')
  ],
  changeEmail
);

// ========== 密码重置（无需登录） ==========

// 忘记密码 - 发送重置验证码
router.post('/forgot-password',
  [
    body('email').isEmail().withMessage('邮箱格式不正确')
  ],
  forgotPassword
);

// 重置密码
router.post('/reset-password',
  [
    body('email').isEmail().withMessage('邮箱格式不正确'),
    body('code').notEmpty().withMessage('验证码不能为空'),
    body('newPassword').isLength({ min: 6 }).withMessage('新密码至少6位')
  ],
  resetPassword
);

module.exports = router;
