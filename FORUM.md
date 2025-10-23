# 论坛功能说明文档

## 概述

论坛模块为河海大学110周年校庆网站提供完整的社区讨论功能,支持多板块管理、帖子发表、回复互动、点赞等功能。用户可以在论坛中分享校庆相关的话题、回忆、建议等内容。

## 功能特点

### 1. 多板块管理
- 支持创建多个讨论板块,按主题分类
- 板块可设置名称、描述、图标和排序
- 板块状态可设为活跃(active)或归档(archived)
- 每个板块统计帖子数和回复数

### 2. 帖子系统
- 用户可发表图文帖子
- 支持帖子标题和富文本内容
- 支持上传多张图片
- 帖子浏览数自动统计
- 支持多种排序方式:
  - 最新: 按发帖时间排序
  - 热门: 按回复数和浏览数排序
  - 精华: 置顶和加精帖子优先
  - 活跃: 按最后回复时间排序
- 支持关键词搜索

### 3. 回复系统
- 支持对帖子的直接回复(顶级回复)
- 支持楼中楼(对回复的再回复)
- 顶级回复自动分配楼层号
- 显示回复用户的详细信息
- 嵌套显示子回复

### 4. 点赞互动
- 用户可对帖子和回复点赞
- 支持取消点赞
- 自动统计点赞数
- 登录用户可查看自己的点赞状态

### 5. 管理功能
管理员拥有以下权限:
- **板块管理**: 创建、编辑、删除板块
- **置顶帖子**: 将重要帖子置顶显示
- **加精帖子**: 标记优质帖子为精华
- **锁定帖子**: 锁定后无法继续回复
- **内容审核**: 审核待发布的帖子和回复
- **内容管理**: 删除违规内容

### 6. 权限控制
- **游客**: 可浏览所有公开内容
- **登录用户**: 可发帖、回复、点赞,可编辑/删除自己的内容
- **管理员**: 拥有所有管理权限

## 数据模型

### Forum (论坛板块)
```javascript
{
  id: Integer,              // 主键
  name: String(100),        // 板块名称
  description: Text,        // 板块描述
  icon: String(500),        // 板块图标URL
  order: Integer,           // 排序顺序
  status: Enum,             // 板块状态: active/archived
  postCount: Integer,       // 帖子总数
  replyCount: Integer,      // 回复总数
  createdAt: DateTime,      // 创建时间
  updatedAt: DateTime       // 更新时间
}
```

### ForumPost (论坛帖子)
```javascript
{
  id: Integer,              // 主键
  forumId: Integer,         // 所属板块ID
  userId: Integer,          // 发帖用户ID
  title: String(200),       // 帖子标题
  content: Text,            // 帖子内容
  images: JSON,             // 图片URLs数组
  isSticky: Boolean,        // 是否置顶
  isHighlighted: Boolean,   // 是否加精
  status: Enum,             // 状态: pending/approved/rejected/locked
  views: Integer,           // 浏览次数
  likes: Integer,           // 点赞数
  replyCount: Integer,      // 回复数量
  lastReplyAt: DateTime,    // 最后回复时间
  lastReplyUserId: Integer, // 最后回复用户ID
  createdAt: DateTime,      // 创建时间
  updatedAt: DateTime       // 更新时间
}
```

### ForumReply (论坛回复)
```javascript
{
  id: Integer,              // 主键
  postId: Integer,          // 所属帖子ID
  userId: Integer,          // 回复用户ID
  content: Text,            // 回复内容
  images: JSON,             // 图片URLs数组
  parentId: Integer,        // 父回复ID (楼中楼)
  replyToUserId: Integer,   // 被回复的用户ID
  status: Enum,             // 状态: pending/approved/rejected
  likes: Integer,           // 点赞数
  floor: Integer,           // 楼层号 (仅顶级回复)
  createdAt: DateTime,      // 创建时间
  updatedAt: DateTime       // 更新时间
}
```

### ForumLike (论坛点赞记录)
```javascript
{
  id: Integer,              // 主键
  userId: Integer,          // 点赞用户ID
  targetType: Enum,         // 点赞目标类型: post/reply
  targetId: Integer,        // 点赞目标ID
  createdAt: DateTime,      // 创建时间
  updatedAt: DateTime       // 更新时间
}
```

## API接口

### 板块接口
- `GET /api/v1/forum/forums` - 获取所有板块
- `GET /api/v1/forum/forums/:id` - 获取板块详情
- `POST /api/v1/forum/forums` - 创建板块 (管理员)
- `PUT /api/v1/forum/forums/:id` - 更新板块 (管理员)
- `DELETE /api/v1/forum/forums/:id` - 删除板块 (管理员)

### 帖子接口
- `GET /api/v1/forum/posts` - 获取帖子列表
- `GET /api/v1/forum/posts/:id` - 获取帖子详情
- `POST /api/v1/forum/posts` - 创建帖子 (需登录)
- `PUT /api/v1/forum/posts/:id` - 更新帖子 (作者或管理员)
- `DELETE /api/v1/forum/posts/:id` - 删除帖子 (作者或管理员)

### 回复接口
- `GET /api/v1/forum/posts/:postId/replies` - 获取回复列表
- `POST /api/v1/forum/posts/:postId/replies` - 创建回复 (需登录)
- `DELETE /api/v1/forum/replies/:id` - 删除回复 (作者或管理员)

### 点赞接口
- `POST /api/v1/forum/:targetType/:targetId/like` - 点赞
- `DELETE /api/v1/forum/:targetType/:targetId/like` - 取消点赞

### 管理员接口
- `PUT /api/v1/forum/posts/:id/sticky` - 置顶/取消置顶
- `PUT /api/v1/forum/posts/:id/highlight` - 加精/取消加精
- `PUT /api/v1/forum/posts/:id/lock` - 锁定/解锁
- `PUT /api/v1/forum/posts/:id/review` - 审核帖子
- `PUT /api/v1/forum/replies/:id/review` - 审核回复

详细的API文档请参考 [API_NEW.md](./API_NEW.md#8-论坛接口-apiv1forum-新增)

## 使用场景

### 场景1: 浏览论坛
1. 用户访问论坛首页
2. 系统显示所有活跃板块列表
3. 用户选择感兴趣的板块
4. 系统显示该板块下的帖子列表
5. 用户可切换不同的排序方式查看帖子

### 场景2: 发表帖子
1. 用户登录系统
2. 选择要发帖的板块
3. 填写帖子标题和内容
4. 可选上传相关图片
5. 提交帖子
6. 帖子自动审核通过并显示在列表中

### 场景3: 参与讨论
1. 用户浏览帖子详情
2. 阅读其他用户的回复
3. 对感兴趣的回复进行点赞
4. 发表自己的看法(顶级回复)
5. 或对某个回复进行回复(楼中楼)

### 场景4: 内容管理
1. 管理员登录系统
2. 浏览论坛内容
3. 对优质帖子进行置顶或加精
4. 对违规内容进行锁定或删除
5. 审核待发布的内容

## 前端实现建议

### 1. 论坛首页
```javascript
// 获取所有活跃板块
const getForums = async () => {
  const response = await fetch('/api/v1/forum/forums?status=active');
  const data = await response.json();

  // 显示板块列表
  // - 板块名称和描述
  // - 板块图标
  // - 帖子数和回复数统计
};
```

### 2. 板块页面
```javascript
// 获取指定板块的帖子列表
const getPosts = async (forumId, sort = 'latest', page = 1) => {
  const response = await fetch(
    `/api/v1/forum/posts?forumId=${forumId}&sort=${sort}&page=${page}&limit=20`
  );
  const data = await response.json();

  // 显示帖子列表
  // - 置顶帖子高亮显示
  // - 显示标题、作者、浏览数、回复数、点赞数
  // - 显示最后回复时间
};
```

### 3. 帖子详情页
```javascript
// 获取帖子详情和回复
const getPostDetail = async (postId) => {
  // 获取帖子详情
  const postResponse = await fetch(`/api/v1/forum/posts/${postId}`, {
    headers: {
      'Authorization': `Bearer ${token}` // 可选
    }
  });
  const postData = await postResponse.json();

  // 获取回复列表
  const repliesResponse = await fetch(
    `/api/v1/forum/posts/${postId}/replies?page=1&limit=20`
  );
  const repliesData = await repliesResponse.json();

  // 显示帖子内容
  // 显示回复列表(包括楼中楼)
  // 显示点赞按钮和点赞状态
};
```

### 4. 发帖功能
```javascript
// 创建新帖子
const createPost = async (forumId, title, content, images) => {
  const response = await fetch('/api/v1/forum/posts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      forumId,
      title,
      content,
      images
    })
  });

  const data = await response.json();
  if (data.code === 201) {
    // 跳转到帖子详情页
    window.location.href = `/forum/posts/${data.data.post.id}`;
  }
};
```

### 5. 回复功能
```javascript
// 发表回复
const createReply = async (postId, content, parentId = null) => {
  const response = await fetch(`/api/v1/forum/posts/${postId}/replies`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content,
      parentId
    })
  });

  const data = await response.json();
  if (data.code === 201) {
    // 刷新回复列表
    refreshReplies();
  }
};
```

### 6. 点赞功能
```javascript
// 点赞/取消点赞
const toggleLike = async (targetType, targetId, isLiked) => {
  const method = isLiked ? 'DELETE' : 'POST';
  const response = await fetch(
    `/api/v1/forum/${targetType}/${targetId}/like`,
    {
      method,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  const data = await response.json();
  if (data.code === 200) {
    // 更新点赞数和点赞状态
    updateLikeCount(targetId, data.data.likes);
    updateLikeStatus(targetId, !isLiked);
  }
};
```

## 注意事项

### 1. 性能优化
- 帖子列表使用分页加载,避免一次性加载过多数据
- 帖子详情页的浏览数增加使用异步更新
- 回复列表采用分页或虚拟滚动

### 2. 安全性
- 所有用户提交的内容需要进行XSS过滤
- 防止SQL注入,使用参数化查询
- 实施频率限制,防止刷帖和刷赞
- 敏感内容需要人工审核

### 3. 用户体验
- 提供实时的点赞状态反馈
- 编辑帖子和回复时保存草稿
- 图片上传时显示进度
- 支持Markdown或富文本编辑器
- 移动端适配和响应式设计

### 4. 内容管理
- 建立内容审核机制
- 定期清理违规内容
- 设置关键词过滤
- 保留删除日志便于追溯

## 扩展功能建议

### 1. 用户相关
- 用户等级和积分系统
- 用户勋章和成就
- 关注用户功能
- 私信系统

### 2. 内容相关
- 帖子标签功能
- 收藏帖子功能
- 帖子分享功能
- 热门话题推荐

### 3. 互动相关
- 表情包支持
- @提醒功能
- 消息通知系统
- 评论举报功能

### 4. 数据分析
- 用户活跃度统计
- 热门话题分析
- 板块流量统计
- 内容质量评估

## 数据库索引建议

为了提高查询性能,建议创建以下索引:

```sql
-- Forum表
CREATE INDEX idx_forum_status ON forums(status);
CREATE INDEX idx_forum_order ON forums(`order`);

-- ForumPost表
CREATE INDEX idx_post_forum ON forum_posts(forumId);
CREATE INDEX idx_post_user ON forum_posts(userId);
CREATE INDEX idx_post_status ON forum_posts(status);
CREATE INDEX idx_post_sticky_reply ON forum_posts(isSticky, lastReplyAt);
CREATE INDEX idx_post_created ON forum_posts(createdAt);

-- ForumReply表
CREATE INDEX idx_reply_post ON forum_replies(postId);
CREATE INDEX idx_reply_user ON forum_replies(userId);
CREATE INDEX idx_reply_parent ON forum_replies(parentId);
CREATE INDEX idx_reply_status ON forum_replies(status);
CREATE INDEX idx_reply_created ON forum_replies(createdAt);

-- ForumLike表
CREATE UNIQUE INDEX idx_like_unique ON forum_likes(userId, targetType, targetId);
CREATE INDEX idx_like_target ON forum_likes(targetType, targetId);
```

## 总结

论坛功能为河海大学110周年校庆网站提供了一个完整的社区讨论平台,用户可以在这里分享回忆、交流想法、提出建议。通过合理的权限控制和内容管理,可以营造良好的社区氛围,增强校友之间的互动和凝聚力。
