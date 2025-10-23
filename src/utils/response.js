const response = (res, code, message, data = null) => {
  return res.status(getHttpStatus(code)).json({
    code,
    message,
    data
  });
};

const success = (res, message = '成功', data = null, httpStatus = 200) => {
  return res.status(httpStatus).json({
    code: 0,
    message,
    data
  });
};

const error = (res, message, code = 500) => {
  return res.status(code).json({
    code,
    message,
    data: null
  });
};

const getHttpStatus = (code) => {
  const statusMap = {
    0: 200,
    400: 400,
    401: 401,
    403: 403,
    404: 404,
    409: 409,
    500: 500,
    503: 503
  };
  return statusMap[code] || 500;
};

module.exports = {
  response,
  success,
  error
};
