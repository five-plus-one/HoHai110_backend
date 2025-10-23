const { verifyToken } = require('../utils/jwt');
const { error } = require('../utils/response');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 401, '未授权访问，请提供有效的token');
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return error(res, 401, 'Token已过期或无效');
    }

    // Get user from database
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return error(res, 401, '用户不存在');
    }

    req.user = user;
    next();
  } catch (err) {
    return error(res, 401, '认证失败');
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);

      if (decoded) {
        const user = await User.findByPk(decoded.userId);
        if (user) {
          req.user = user;
        }
      }
    }

    next();
  } catch (err) {
    next();
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return error(res, 401, '未授权访问');
    }

    if (req.user.role !== 'admin') {
      return error(res, 403, '需要管理员权限');
    }

    next();
  } catch (err) {
    return error(res, 403, '权限验证失败');
  }
};

module.exports = {
  auth,
  optionalAuth,
  isAdmin
};
