module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'hohai110-secret-key-change-in-production',
  JWT_EXPIRE: '24h',
  JWT_REFRESH_EXPIRE: '7d',
  BCRYPT_ROUNDS: 10,
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};
