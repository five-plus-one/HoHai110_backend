const { Article, Comment, User } = require('../models');
const { validationResult } = require('express-validator');

// 获取文章列表
exports.getArticles = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, status = 'published' } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (category) where.category = category;
    if (status) where.status = status;

    const { count, rows } = await Article.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['publishedAt', 'DESC'], ['createdAt', 'DESC']],
      attributes: { exclude: ['content'] }
    });

    res.json({
      code: 200,
      message: '获取文章列表成功',
      data: {
        articles: rows,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取文章详情
exports.getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await Article.findByPk(id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar', 'bio']
      }]
    });

    if (!article) {
      return res.status(404).json({
        code: 404,
        message: '文章不存在',
        data: null
      });
    }

    // 增加浏览量
    await article.increment('views');

    res.json({
      code: 200,
      message: '获取文章详情成功',
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// 创建文章
exports.createArticle = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        message: '参数验证失败',
        data: errors.array()
      });
    }

    const { title, content, summary, coverImage, category, status, tags } = req.body;

    const article = await Article.create({
      title,
      content,
      summary,
      coverImage,
      category,
      status,
      tags: tags || [],
      authorId: req.user.id,
      publishedAt: status === 'published' ? new Date() : null
    });

    res.status(201).json({
      code: 201,
      message: '文章创建成功',
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// 更新文章
exports.updateArticle = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        message: '参数验证失败',
        data: errors.array()
      });
    }

    const { id } = req.params;
    const { title, content, summary, coverImage, category, status, tags } = req.body;

    const article = await Article.findByPk(id);

    if (!article) {
      return res.status(404).json({
        code: 404,
        message: '文章不存在',
        data: null
      });
    }

    // 检查权限
    if (article.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        code: 403,
        message: '无权限修改此文章',
        data: null
      });
    }

    const updateData = {
      title,
      content,
      summary,
      coverImage,
      category,
      status,
      tags
    };

    // 如果从草稿改为发布状态,设置发布时间
    if (article.status !== 'published' && status === 'published') {
      updateData.publishedAt = new Date();
    }

    await article.update(updateData);

    res.json({
      code: 200,
      message: '文章更新成功',
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// 删除文章
exports.deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await Article.findByPk(id);

    if (!article) {
      return res.status(404).json({
        code: 404,
        message: '文章不存在',
        data: null
      });
    }

    // 检查权限
    if (article.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        code: 403,
        message: '无权限删除此文章',
        data: null
      });
    }

    await article.destroy();

    res.json({
      code: 200,
      message: '文章删除成功',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
