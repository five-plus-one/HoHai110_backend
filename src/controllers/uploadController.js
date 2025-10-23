const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { success, error } = require('../utils/response');
const { UPLOAD_DIR, MAX_FILE_SIZE } = require('../config/constants');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.body.type || 'image';
    const dir = path.join(UPLOAD_DIR, type);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const type = req.body.type || 'image';

  if (type === 'image') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'), false);
    }
  } else if (type === 'video') {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传视频文件'), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});

// Upload handler
const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return error(res, 400, '请选择要上传的文件');
    }

    const type = req.body.type || 'image';
    const fileUrl = `/uploads/${type}/${req.file.filename}`;

    return success(res, {
      url: fileUrl,
      fileSize: req.file.size,
      uploadedAt: new Date()
    }, '上传成功');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  upload,
  uploadMedia
};
