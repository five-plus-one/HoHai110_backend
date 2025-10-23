const express = require('express');
const router = express.Router();
const { upload, uploadMedia } = require('../controllers/uploadController');
const { auth } = require('../middleware/auth');

// 上传图片/视频
router.post('/media', auth, upload.single('file'), uploadMedia);

module.exports = router;
