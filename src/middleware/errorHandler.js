const { error } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message);
    return error(res, messages.join(', '), 400);
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return error(res, '该记录已存在', 409);
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return error(res, '关联数据不存在', 400);
  }

  // Sequelize database error (e.g., table doesn't exist)
  if (err.name === 'SequelizeDatabaseError') {
    if (err.original && err.original.code === 'ER_NO_SUCH_TABLE') {
      return error(res, '数据库表不存在,请运行数据库同步', 500);
    }
    return error(res, '数据库错误: ' + (err.original?.sqlMessage || err.message), 500);
  }

  // Default error
  return error(res, err.message || '服务器内部错误', 500);
};

module.exports = errorHandler;
