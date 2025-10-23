const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { addTorch, getTorch } = require('../controllers/torchController');

// 增加火炬数量
router.post('/add',
  [
    body('count')
      .optional()
      .isInt({ min: 1 }).withMessage('火炬数量必须为正整数')
  ],
  addTorch
);

// 获取火炬数量
router.get('/get', getTorch);

module.exports = router;
