const { Comment, User, Article } = require('../models');
const { validationResult } = require('express-validator');

// 获取文章评论列表
exports.getComments = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // 验证文章是否存在
    const article = await Article.findByPk(articleId);
    if (!article) {
      return res.status(404).json({
        code: 404,
        message: '文章不存在',
        data: null
      });
    }

    const { count, rows } = await Comment.findAndCountAll({
      where: {
        articleId,
        parentId: null,
        status: 'approved'
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: Comment,
          as: 'replies',
          where: { status: 'approved' },
          required: false,
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'avatar']
          }],
          order: [['createdAt', 'ASC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      code: 200,
      message: '获取评论成功',
      data: {
        comments: rows,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// 创建评论
exports.createComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        message: '参数验证失败',
        data: errors.array()
      });
    }

    const { articleId } = req.params;
    const { content, parentId } = req.body;

    // 验证文章是否存在
    const article = await Article.findByPk(articleId);
    if (!article) {
      return res.status(404).json({
        code: 404,
        message: '文章不存在',
        data: null
      });
    }

    // 如果是回复评论,验证父评论是否存在
    if (parentId) {
      const parentComment = await Comment.findByPk(parentId);
      if (!parentComment || parentComment.articleId !== parseInt(articleId)) {
        return res.status(404).json({
          code: 404,
          message: '父评论不存在或不属于该文章',
          data: null
        });
      }
    }

    const comment = await Comment.create({
      content,
      articleId,
      userId: req.user.id,
      parentId: parentId || null
    });

    const newComment = await Comment.findByPk(comment.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      }]
    });

    res.status(201).json({
      code: 201,
      message: '评论发布成功',
      data: newComment
    });
  } catch (error) {
    next(error);
  }
};

// 删除评论
exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({
        code: 404,
        message: '评论不存在',
        data: null
      });
    }

    // 检查权限:只有评论作者或管理员可以删除
    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        code: 403,
        message: '无权限删除此评论',
        data: null
      });
    }

    await comment.destroy();

    res.json({
      code: 200,
      message: '评论删除成功',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// 点赞评论
exports.likeComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({
        code: 404,
        message: '评论不存在',
        data: null
      });
    }

    await comment.increment('likes');

    res.json({
      code: 200,
      message: '点赞成功',
      data: { likes: comment.likes + 1 }
    });
  } catch (error) {
    next(error);
  }
};

// 取消点赞评论
exports.unlikeComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({
        code: 404,
        message: '评论不存在',
        data: null
      });
    }

    // 防止点赞数为负数
    if (comment.likes > 0) {
      await comment.decrement('likes');
    }

    res.json({
      code: 200,
      message: '取消点赞成功',
      data: { likes: Math.max(0, comment.likes - 1) }
    });
  } catch (error) {
    next(error);
  }
};
