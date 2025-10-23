const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { auth, isAdmin } = require('../middleware/auth');
const {
  getDashboardStats,
  getPendingContent,
  reviewComment,
  reviewBlessing,
  getUsers,
  deleteUser,
  batchDelete,
  updateUserRole,
  updateUser,
  batchDeleteUsers,
  createUser,
  getSystemConfig,
  getAllSystemConfigs,
  setRegistrationEnabled,
  setSmtpConfig,
  testSmtpConnection
} = require('../controllers/adminController');

// 所有管理员路由都需要管理员权限
router.use(auth);
router.use(isAdmin);

// ========== 统计和审核 ==========

// 获取统计数据
router.get('/stats', getDashboardStats);

// 获取待审核内容
router.get('/pending', getPendingContent);

// 审核评论
router.put('/comments/:id/review',
  [
    body('status').isIn(['approved', 'rejected']).withMessage('无效的审核状态')
  ],
  reviewComment
);

// 审核祝福
router.put('/blessings/:id/review',
  [
    body('status').isIn(['approved', 'rejected']).withMessage('无效的审核状态')
  ],
  reviewBlessing
);

// ========== 用户管理 ==========

// 获取用户列表
router.get('/users', getUsers);

// 添加用户
router.post('/users',
  [
    body('username').notEmpty().withMessage('用户名不能为空'),
    body('email').isEmail().withMessage('邮箱格式不正确'),
    body('password').isLength({ min: 6 }).withMessage('密码至少6位'),
    body('role').optional().isIn(['user', 'admin']).withMessage('无效的角色类型')
  ],
  createUser
);

// 修改用户角色
router.put('/users/:id/role',
  [
    body('role').isIn(['user', 'admin']).withMessage('无效的角色类型')
  ],
  updateUserRole
);

// 编辑用户信息
router.put('/users/:id',
  [
    body('username').optional().notEmpty().withMessage('用户名不能为空'),
    body('email').optional().isEmail().withMessage('邮箱格式不正确'),
    body('password').optional().isLength({ min: 6 }).withMessage('密码至少6位')
  ],
  updateUser
);

// 删除单个用户
router.delete('/users/:id', deleteUser);

// 批量删除用户
router.post('/users/batch-delete',
  [
    body('ids').isArray().withMessage('ids必须是数组')
  ],
  batchDeleteUsers
);

// ========== 批量删除内容 ==========

// 批量删除内容（评论、祝福、文章）
router.post('/batch-delete',
  [
    body('type').isIn(['comment', 'blessing', 'article']).withMessage('无效的内容类型'),
    body('ids').isArray().withMessage('ids必须是数组')
  ],
  batchDelete
);

// ========== 系统配置 ==========

// 获取所有系统配置
router.get('/configs', getAllSystemConfigs);

// 获取单个系统配置
router.get('/configs/:key', getSystemConfig);

// 设置注册开关
router.put('/configs/registration',
  [
    body('enabled').isBoolean().withMessage('enabled必须是布尔值')
  ],
  setRegistrationEnabled
);

// 设置SMTP配置
router.put('/configs/smtp',
  [
    body('host').notEmpty().withMessage('SMTP服务器地址不能为空'),
    body('user').notEmpty().withMessage('SMTP用户名不能为空'),
    body('password').notEmpty().withMessage('SMTP密码不能为空'),
    body('port').optional().isInt().withMessage('端口必须是数字'),
    body('secure').optional().isBoolean().withMessage('secure必须是布尔值')
  ],
  setSmtpConfig
);

// 测试SMTP连接
router.post('/configs/smtp/test', testSmtpConnection);

module.exports = router;
