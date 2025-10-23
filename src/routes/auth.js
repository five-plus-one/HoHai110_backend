const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, refresh, getRegistrationStatus } = require('../controllers/authController');

// 查询注册状态（公开接口）
router.get('/registration-status', getRegistrationStatus);

// 用户注册
router.post('/register',
  [
    body('username')
      .notEmpty().withMessage('用户名不能为空')
      .isLength({ min: 3, max: 50 }).withMessage('用户名长度应在3-50个字符之间'),
    body('email')
      .notEmpty().withMessage('邮箱不能为空')
      .isEmail().withMessage('请输入有效的邮箱地址'),
    body('password')
      .notEmpty().withMessage('密码不能为空')
      .isLength({ min: 6 }).withMessage('密码长度至少为6个字符'),
    body('confirmPassword')
      .notEmpty().withMessage('确认密码不能为空')
  ],
  register
);

// 用户登录
router.post('/login',
  [
    body('username').notEmpty().withMessage('用户名/邮箱不能为空'),
    body('password').notEmpty().withMessage('密码不能为空')
  ],
  login
);

// Token刷新
router.post('/refresh', refresh);

module.exports = router;
