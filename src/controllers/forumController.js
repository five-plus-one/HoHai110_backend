const { Forum, ForumPost, ForumReply, ForumLike, User } = require('../models');
const { success: successResponse, error: errorResponse } = require('../utils/response');
const { Op } = require('sequelize');

/**
 * 论坛控制器
 * 处理论坛板块、帖子、回复和点赞的业务逻辑
 */

// ==================== 板块管理 ====================

/**
 * 获取所有论坛板块
 */
exports.getForums = async (req, res) => {
  try {
    const { status = 'active' } = req.query;

    const forums = await Forum.findAll({
      where: status ? { status } : {},
      order: [['order', 'ASC'], ['id', 'ASC']],
      attributes: ['id', 'name', 'description', 'icon', 'order', 'status', 'postCount', 'replyCount', 'createdAt']
    });

    return successResponse(res, '获取论坛板块成功', { forums });
  } catch (error) {
    console.error('Get forums error:', error);
    return errorResponse(res, '获取论坛板块失败', 500);
  }
};

/**
 * 获取单个论坛板块详情
 */
exports.getForumById = async (req, res) => {
  try {
    const { id } = req.params;

    const forum = await Forum.findByPk(id, {
      attributes: ['id', 'name', 'description', 'icon', 'order', 'status', 'postCount', 'replyCount', 'createdAt']
    });

    if (!forum) {
      return errorResponse(res, '论坛板块不存在', 404);
    }

    return successResponse(res, '获取论坛板块详情成功', { forum });
  } catch (error) {
    console.error('Get forum by id error:', error);
    return errorResponse(res, '获取论坛板块详情失败', 500);
  }
};

/**
 * 创建论坛板块 (管理员)
 */
exports.createForum = async (req, res) => {
  try {
    const { name, description, icon, order } = req.body;

    if (!name) {
      return errorResponse(res, '板块名称不能为空', 400);
    }

    const forum = await Forum.create({
      name,
      description,
      icon,
      order: order || 0
    });

    return successResponse(res, '创建论坛板块成功', { forum }, 201);
  } catch (error) {
    console.error('Create forum error:', error);
    return errorResponse(res, '创建论坛板块失败', 500);
  }
};

/**
 * 更新论坛板块 (管理员)
 */
exports.updateForum = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, order, status } = req.body;

    const forum = await Forum.findByPk(id);
    if (!forum) {
      return errorResponse(res, '论坛板块不存在', 404);
    }

    await forum.update({
      name: name !== undefined ? name : forum.name,
      description: description !== undefined ? description : forum.description,
      icon: icon !== undefined ? icon : forum.icon,
      order: order !== undefined ? order : forum.order,
      status: status !== undefined ? status : forum.status
    });

    return successResponse(res, '更新论坛板块成功', { forum });
  } catch (error) {
    console.error('Update forum error:', error);
    return errorResponse(res, '更新论坛板块失败', 500);
  }
};

/**
 * 删除论坛板块 (管理员)
 */
exports.deleteForum = async (req, res) => {
  try {
    const { id } = req.params;

    const forum = await Forum.findByPk(id);
    if (!forum) {
      return errorResponse(res, '论坛板块不存在', 404);
    }

    // 检查板块下是否有帖子
    const postCount = await ForumPost.count({ where: { forumId: id } });
    if (postCount > 0) {
      return errorResponse(res, '该板块下还有帖子,无法删除', 400);
    }

    await forum.destroy();
    return successResponse(res, '删除论坛板块成功');
  } catch (error) {
    console.error('Delete forum error:', error);
    return errorResponse(res, '删除论坛板块失败', 500);
  }
};

// ==================== 帖子管理 ====================

/**
 * 获取论坛帖子列表
 */
exports.getPosts = async (req, res) => {
  try {
    const {
      forumId,
      page = 1,
      limit = 20,
      sort = 'latest',
      status = 'approved',
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (forumId) {
      where.forumId = forumId;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }

    // 排序方式
    let order;
    switch (sort) {
      case 'hot': // 热门: 按回复数和浏览数排序
        order = [['replyCount', 'DESC'], ['views', 'DESC']];
        break;
      case 'top': // 精华: 置顶优先,然后按加精和时间排序
        order = [['isSticky', 'DESC'], ['isHighlighted', 'DESC'], ['createdAt', 'DESC']];
        break;
      case 'active': // 活跃: 按最后回复时间排序
        order = [['isSticky', 'DESC'], ['lastReplyAt', 'DESC']];
        break;
      case 'latest': // 最新: 按创建时间排序
      default:
        order = [['isSticky', 'DESC'], ['createdAt', 'DESC']];
    }

    const { count, rows: posts } = await ForumPost.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: Forum,
          as: 'forum',
          attributes: ['id', 'name']
        }
      ],
      distinct: true
    });

    return successResponse(res, '获取帖子列表成功', {
      posts,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    return errorResponse(res, '获取帖子列表失败', 500);
  }
};

/**
 * 获取帖子详情
 */
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await ForumPost.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatar', 'graduationYear', 'department']
        },
        {
          model: Forum,
          as: 'forum',
          attributes: ['id', 'name', 'description']
        }
      ]
    });

    if (!post) {
      return errorResponse(res, '帖子不存在', 404);
    }

    // 增加浏览次数
    await post.increment('views');

    // 检查当前用户是否点赞
    let isLiked = false;
    if (req.user) {
      const like = await ForumLike.findOne({
        where: {
          userId: req.user.id,
          targetType: 'post',
          targetId: id
        }
      });
      isLiked = !!like;
    }

    const postData = post.toJSON();
    postData.isLiked = isLiked;

    return successResponse(res, '获取帖子详情成功', { post: postData });
  } catch (error) {
    console.error('Get post by id error:', error);
    return errorResponse(res, '获取帖子详情失败', 500);
  }
};

/**
 * 创建帖子 (需要登录)
 */
exports.createPost = async (req, res) => {
  try {
    const { forumId, title, content, images } = req.body;
    const userId = req.user.id;

    if (!forumId || !title || !content) {
      return errorResponse(res, '板块ID、标题和内容不能为空', 400);
    }

    // 验证论坛板块是否存在
    const forum = await Forum.findByPk(forumId);
    if (!forum) {
      return errorResponse(res, '论坛板块不存在', 404);
    }

    if (forum.status !== 'active') {
      return errorResponse(res, '该板块已归档,无法发帖', 400);
    }

    // 创建帖子
    const post = await ForumPost.create({
      forumId,
      userId,
      title,
      content,
      images: images || []
    });

    // 更新板块帖子数
    await forum.increment('postCount');

    // 加载关联数据
    await post.reload({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: Forum,
          as: 'forum',
          attributes: ['id', 'name']
        }
      ]
    });

    return successResponse(res, '发帖成功', { post }, 201);
  } catch (error) {
    console.error('Create post error:', error);
    return errorResponse(res, '发帖失败', 500);
  }
};

/**
 * 更新帖子 (作者或管理员)
 */
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, images } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const post = await ForumPost.findByPk(id);
    if (!post) {
      return errorResponse(res, '帖子不存在', 404);
    }

    // 权限检查: 只有作者或管理员可以编辑
    if (post.userId !== userId && !isAdmin) {
      return errorResponse(res, '无权编辑此帖子', 403);
    }

    await post.update({
      title: title !== undefined ? title : post.title,
      content: content !== undefined ? content : post.content,
      images: images !== undefined ? images : post.images
    });

    await post.reload({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatar']
        }
      ]
    });

    return successResponse(res, '更新帖子成功', { post });
  } catch (error) {
    console.error('Update post error:', error);
    return errorResponse(res, '更新帖子失败', 500);
  }
};

/**
 * 删除帖子 (作者或管理员)
 */
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const post = await ForumPost.findByPk(id);
    if (!post) {
      return errorResponse(res, '帖子不存在', 404);
    }

    // 权限检查
    if (post.userId !== userId && !isAdmin) {
      return errorResponse(res, '无权删除此帖子', 403);
    }

    const forumId = post.forumId;
    const replyCount = post.replyCount;

    await post.destroy();

    // 更新板块统计
    const forum = await Forum.findByPk(forumId);
    if (forum) {
      await forum.decrement('postCount');
      await forum.decrement('replyCount', { by: replyCount });
    }

    return successResponse(res, '删除帖子成功');
  } catch (error) {
    console.error('Delete post error:', error);
    return errorResponse(res, '删除帖子失败', 500);
  }
};

// ==================== 回复管理 ====================

/**
 * 获取帖子回复列表
 */
exports.getReplies = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20, sort = 'asc' } = req.query;

    const offset = (page - 1) * limit;
    const order = sort === 'desc' ? [['createdAt', 'DESC']] : [['floor', 'ASC']];

    const { count, rows: replies } = await ForumReply.findAndCountAll({
      where: {
        postId,
        parentId: null, // 只获取顶级回复
        status: 'approved'
      },
      limit: parseInt(limit),
      offset,
      order,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatar', 'graduationYear', 'department']
        },
        {
          model: ForumReply,
          as: 'childReplies',
          where: { status: 'approved' },
          required: false,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'avatar']
            }
          ]
        }
      ]
    });

    // 检查当前用户的点赞状态
    let likedReplies = [];
    if (req.user) {
      const allReplyIds = [];
      replies.forEach(reply => {
        allReplyIds.push(reply.id);
        if (reply.childReplies) {
          reply.childReplies.forEach(child => allReplyIds.push(child.id));
        }
      });

      const likes = await ForumLike.findAll({
        where: {
          userId: req.user.id,
          targetType: 'reply',
          targetId: allReplyIds
        }
      });
      likedReplies = likes.map(like => like.targetId);
    }

    const repliesWithLikeStatus = replies.map(reply => {
      const replyData = reply.toJSON();
      replyData.isLiked = likedReplies.includes(reply.id);
      if (replyData.childReplies) {
        replyData.childReplies = replyData.childReplies.map(child => ({
          ...child,
          isLiked: likedReplies.includes(child.id)
        }));
      }
      return replyData;
    });

    return successResponse(res, '获取回复列表成功', {
      replies: repliesWithLikeStatus,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get replies error:', error);
    return errorResponse(res, '获取回复列表失败', 500);
  }
};

/**
 * 创建回复 (需要登录)
 */
exports.createReply = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, images, parentId, replyToUserId } = req.body;
    const userId = req.user.id;

    if (!content) {
      return errorResponse(res, '回复内容不能为空', 400);
    }

    // 验证帖子是否存在
    const post = await ForumPost.findByPk(postId);
    if (!post) {
      return errorResponse(res, '帖子不存在', 404);
    }

    if (post.status === 'locked') {
      return errorResponse(res, '帖子已锁定,无法回复', 400);
    }

    // 如果是楼中楼回复,验证父回复
    if (parentId) {
      const parentReply = await ForumReply.findByPk(parentId);
      if (!parentReply || parentReply.postId !== parseInt(postId)) {
        return errorResponse(res, '父回复不存在或不属于此帖子', 400);
      }
    }

    // 计算楼层号 (仅顶级回复有楼层号)
    let floor = null;
    if (!parentId) {
      const maxFloor = await ForumReply.max('floor', {
        where: { postId, parentId: null }
      });
      floor = (maxFloor || 0) + 1;
    }

    // 创建回复
    const reply = await ForumReply.create({
      postId,
      userId,
      content,
      images: images || [],
      parentId: parentId || null,
      replyToUserId: replyToUserId || null,
      floor
    });

    // 更新帖子回复数和最后回复信息
    await post.update({
      replyCount: post.replyCount + 1,
      lastReplyAt: new Date(),
      lastReplyUserId: userId
    });

    // 更新板块回复数
    await Forum.increment('replyCount', { where: { id: post.forumId } });

    // 加载关联数据
    await reply.reload({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatar']
        }
      ]
    });

    return successResponse(res, '回复成功', { reply }, 201);
  } catch (error) {
    console.error('Create reply error:', error);
    return errorResponse(res, '回复失败', 500);
  }
};

/**
 * 删除回复 (作者或管理员)
 */
exports.deleteReply = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const reply = await ForumReply.findByPk(id);
    if (!reply) {
      return errorResponse(res, '回复不存在', 404);
    }

    // 权限检查
    if (reply.userId !== userId && !isAdmin) {
      return errorResponse(res, '无权删除此回复', 403);
    }

    const postId = reply.postId;

    // 统计要删除的回复数(包括子回复)
    const childCount = await ForumReply.count({
      where: { parentId: id }
    });
    const totalDeleteCount = 1 + childCount;

    await reply.destroy();

    // 更新帖子回复数
    const post = await ForumPost.findByPk(postId);
    if (post) {
      await post.decrement('replyCount', { by: totalDeleteCount });

      // 更新最后回复信息
      const lastReply = await ForumReply.findOne({
        where: { postId },
        order: [['createdAt', 'DESC']]
      });

      await post.update({
        lastReplyAt: lastReply ? lastReply.createdAt : null,
        lastReplyUserId: lastReply ? lastReply.userId : null
      });

      // 更新板块回复数
      await Forum.decrement('replyCount', {
        where: { id: post.forumId },
        by: totalDeleteCount
      });
    }

    return successResponse(res, '删除回复成功');
  } catch (error) {
    console.error('Delete reply error:', error);
    return errorResponse(res, '删除回复失败', 500);
  }
};

// ==================== 点赞管理 ====================

/**
 * 点赞帖子或回复
 */
exports.likeTarget = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const userId = req.user.id;

    if (!['post', 'reply'].includes(targetType)) {
      return errorResponse(res, '无效的点赞类型', 400);
    }

    // 检查目标是否存在
    const Model = targetType === 'post' ? ForumPost : ForumReply;
    const target = await Model.findByPk(targetId);
    if (!target) {
      return errorResponse(res, `${targetType === 'post' ? '帖子' : '回复'}不存在`, 404);
    }

    // 检查是否已点赞
    const existingLike = await ForumLike.findOne({
      where: { userId, targetType, targetId }
    });

    if (existingLike) {
      return errorResponse(res, '已经点赞过了', 400);
    }

    // 创建点赞记录
    await ForumLike.create({ userId, targetType, targetId });

    // 增加点赞数
    await target.increment('likes');

    return successResponse(res, '点赞成功', {
      likes: target.likes + 1
    });
  } catch (error) {
    console.error('Like target error:', error);
    return errorResponse(res, '点赞失败', 500);
  }
};

/**
 * 取消点赞
 */
exports.unlikeTarget = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const userId = req.user.id;

    if (!['post', 'reply'].includes(targetType)) {
      return errorResponse(res, '无效的点赞类型', 400);
    }

    // 查找点赞记录
    const like = await ForumLike.findOne({
      where: { userId, targetType, targetId }
    });

    if (!like) {
      return errorResponse(res, '还未点赞', 400);
    }

    // 删除点赞记录
    await like.destroy();

    // 减少点赞数
    const Model = targetType === 'post' ? ForumPost : ForumReply;
    const target = await Model.findByPk(targetId);
    if (target && target.likes > 0) {
      await target.decrement('likes');
    }

    return successResponse(res, '取消点赞成功', {
      likes: Math.max(0, (target?.likes || 1) - 1)
    });
  } catch (error) {
    console.error('Unlike target error:', error);
    return errorResponse(res, '取消点赞失败', 500);
  }
};

// ==================== 管理员功能 ====================

/**
 * 置顶/取消置顶帖子 (管理员)
 */
exports.toggleSticky = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await ForumPost.findByPk(id);
    if (!post) {
      return errorResponse(res, '帖子不存在', 404);
    }

    await post.update({ isSticky: !post.isSticky });

    return successResponse(res, `${post.isSticky ? '置顶' : '取消置顶'}成功`, { post });
  } catch (error) {
    console.error('Toggle sticky error:', error);
    return errorResponse(res, '操作失败', 500);
  }
};

/**
 * 加精/取消加精 (管理员)
 */
exports.toggleHighlight = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await ForumPost.findByPk(id);
    if (!post) {
      return errorResponse(res, '帖子不存在', 404);
    }

    await post.update({ isHighlighted: !post.isHighlighted });

    return successResponse(res, `${post.isHighlighted ? '加精' : '取消加精'}成功`, { post });
  } catch (error) {
    console.error('Toggle highlight error:', error);
    return errorResponse(res, '操作失败', 500);
  }
};

/**
 * 锁定/解锁帖子 (管理员)
 */
exports.toggleLock = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await ForumPost.findByPk(id);
    if (!post) {
      return errorResponse(res, '帖子不存在', 404);
    }

    const newStatus = post.status === 'locked' ? 'approved' : 'locked';
    await post.update({ status: newStatus });

    return successResponse(res, `${newStatus === 'locked' ? '锁定' : '解锁'}成功`, { post });
  } catch (error) {
    console.error('Toggle lock error:', error);
    return errorResponse(res, '操作失败', 500);
  }
};

/**
 * 审核帖子 (管理员)
 */
exports.reviewPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return errorResponse(res, '无效的审核状态', 400);
    }

    const post = await ForumPost.findByPk(id);
    if (!post) {
      return errorResponse(res, '帖子不存在', 404);
    }

    await post.update({ status });

    return successResponse(res, '审核成功', { post });
  } catch (error) {
    console.error('Review post error:', error);
    return errorResponse(res, '审核失败', 500);
  }
};

/**
 * 审核回复 (管理员)
 */
exports.reviewReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return errorResponse(res, '无效的审核状态', 400);
    }

    const reply = await ForumReply.findByPk(id);
    if (!reply) {
      return errorResponse(res, '回复不存在', 404);
    }

    await reply.update({ status });

    return successResponse(res, '审核成功', { reply });
  } catch (error) {
    console.error('Review reply error:', error);
    return errorResponse(res, '审核失败', 500);
  }
};
