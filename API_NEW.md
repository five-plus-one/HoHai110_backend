# API接口文档

## 0. 认证接口 (/api/v1/auth)

### 0.1 用户注册
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```
**响应:**
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "token": "jwt_token_string",
    "refreshToken": "refresh_token_string",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "avatar": null,
      "role": "user"
    }
  }
}
```

### 0.2 用户登录 ⭐已更新
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```
**响应:**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "jwt_token_string",
    "refreshToken": "refresh_token_string",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "avatar": null,
      "role": "user"
    }
  }
}
```
**更新说明:**
- 登录响应中现在包含 `role` 字段，用于区分普通用户和管理员
- role 可能的值: "user" (普通用户) 或 "admin" (管理员)

### 0.3 Token刷新
```http
POST /api/v1/auth/refresh
Authorization: Bearer {refresh_token}
```
**响应:**
```json
{
  "code": 200,
  "message": "Token刷新成功",
  "data": {
    "token": "new_jwt_token_string",
    "refreshToken": "new_refresh_token_string"
  }
}
```

---

## 1. 文章接口 (/api/v1/articles)

### 1.1 获取文章列表
```http
GET /api/v1/articles?page=1&limit=10&category=校庆动态&status=published
```
**响应:**
```json
{
  "code": 200,
  "message": "获取文章列表成功",
  "data": {
    "articles": [...],
    "total": 100,
    "page": 1,
    "totalPages": 10
  }
}
```

### 1.2 获取文章详情
```http
GET /api/v1/articles/:id
```

### 1.3 创建文章 (需要登录)
```http
POST /api/v1/articles
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "文章标题",
  "content": "文章内容",
  "summary": "文章摘要",
  "coverImage": "封面图片URL",
  "category": "校庆动态",
  "status": "published",
  "tags": ["标签1", "标签2"]
}
```

### 1.4 更新文章 (需要登录)
```http
PUT /api/v1/articles/:id
Authorization: Bearer {token}
```

### 1.5 删除文章 (需要登录)
```http
DELETE /api/v1/articles/:id
Authorization: Bearer {token}
```

---

## 2. 评论/留言接口 (/api/v1/comments)

### 2.1 获取文章评论列表
```http
GET /api/v1/comments/article/:articleId?page=1&limit=20
```
**响应:**
```json
{
  "code": 200,
  "message": "获取评论成功",
  "data": {
    "comments": [
      {
        "id": 1,
        "content": "评论内容",
        "user": {
          "id": 1,
          "username": "用户名",
          "avatar": "头像URL"
        },
        "replies": [...],
        "likes": 10,
        "createdAt": "2024-10-19T12:00:00.000Z"
      }
    ],
    "total": 50,
    "page": 1,
    "totalPages": 3
  }
}
```

### 2.2 发表评论 (需要登录)
```http
POST /api/v1/comments/article/:articleId
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "评论内容",
  "parentId": null  // 可选,回复评论时提供父评论ID
}
```

### 2.3 删除评论 (需要登录)
```http
DELETE /api/v1/comments/:id
Authorization: Bearer {token}
```

### 2.4 点赞评论 (需要登录)
```http
POST /api/v1/comments/:id/like
Authorization: Bearer {token}
```
**响应:**
```json
{
  "code": 200,
  "message": "点赞成功",
  "data": {
    "likes": 11
  }
}
```

### 2.5 取消点赞评论 (需要登录) ⭐新增
```http
DELETE /api/v1/comments/:id/like
Authorization: Bearer {token}
```
**响应:**
```json
{
  "code": 200,
  "message": "取消点赞成功",
  "data": {
    "likes": 10
  }
}
```

---

## 3. 祝福接口 (/api/v1/blessings)

### 3.1 获取祝福列表
```http
GET /api/v1/blessings?page=1&limit=20&status=approved
```
**响应:**
```json
{
  "code": 200,
  "message": "获取祝福列表成功",
  "data": {
    "blessings": [
      {
        "id": 1,
        "content": "祝福内容",
        "authorName": "作者姓名",
        "graduationYear": 2020,
        "department": "计算机学院",
        "likes": 10,
        "isAnonymous": false
      }
    ],
    "total": 100,
    "page": 1,
    "totalPages": 5
  }
}
```

### 3.2 获取随机祝福
```http
GET /api/v1/blessings/random?limit=5
```

### 3.3 获取单条祝福
```http
GET /api/v1/blessings/:id
```

### 3.4 发表祝福 (需要登录)
```http
POST /api/v1/blessings
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "祝福内容",
  "isAnonymous": false
}
```

### 3.5 更新祝福 (需要登录)
```http
PUT /api/v1/blessings/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "更新后的祝福内容"
}
```

### 3.6 删除祝福 (需要登录)
```http
DELETE /api/v1/blessings/:id
Authorization: Bearer {token}
```

### 3.7 点赞祝福 (需要登录)
```http
POST /api/v1/blessings/:id/like
Authorization: Bearer {token}
```
**响应:**
```json
{
  "code": 200,
  "message": "点赞成功",
  "data": {
    "likes": 11
  }
}
```

### 3.8 取消点赞祝福 (需要登录) ⭐新增
```http
DELETE /api/v1/blessings/:id/like
Authorization: Bearer {token}
```
**响应:**
```json
{
  "code": 200,
  "message": "取消点赞成功",
  "data": {
    "likes": 10
  }
}
```

---

## 4. 管理员接口 (/api/v1/admin)
**所有管理员接口都需要管理员权限**

### 4.1 获取统计数据
```http
GET /api/v1/admin/stats
Authorization: Bearer {admin_token}
```
**响应:**
```json
{
  "code": 200,
  "message": "获取统计数据成功",
  "data": {
    "users": 1000,
    "articles": 50,
    "blessings": 200,
    "comments": 500,
    "maxims": 150,
    "relayParticipations": 80
  }
}
```

### 4.2 获取待审核内容
```http
GET /api/v1/admin/pending
Authorization: Bearer {admin_token}
```

### 4.3 审核评论
```http
PUT /api/v1/admin/comments/:id/review
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "approved"  // 或 "rejected"
}
```

### 4.4 审核祝福
```http
PUT /api/v1/admin/blessings/:id/review
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "approved"  // 或 "rejected"
}
```

### 4.5 获取用户列表
```http
GET /api/v1/admin/users?page=1&limit=20&search=关键词
Authorization: Bearer {admin_token}
```

### 4.6 删除用户
```http
DELETE /api/v1/admin/users/:id
Authorization: Bearer {admin_token}
```

### 4.7 批量删除内容
```http
POST /api/v1/admin/batch-delete
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "type": "comment",  // 或 "blessing", "article"
  "ids": [1, 2, 3, 4, 5]
}
```

---

## 已移除的接口 ⚠️

以下接口已从系统中移除：

### ~~地图相关接口 (/api/v1/map)~~
- ~~获取校友分布数据~~
- ~~获取特定省份的校友分布~~
- ~~获取特定国家的校友分布~~

### ~~海报相关接口 (/api/v1/posters)~~
- ~~获取海报列表~~
- ~~获取特定分类的海报~~
- ~~下载海报~~

### ~~拼图相关接口 (/api/v1/mosaics)~~
- ~~获取拼图列表~~
- ~~获取拼图详情与进度~~
- ~~保存拼图进度~~
- ~~拼图完成~~

---

## 数据模型

### Article (文章)
- id: 主键
- title: 标题
- content: 内容
- summary: 摘要
- coverImage: 封面图片
- category: 分类 (默认: "校庆动态")
- status: 状态 (draft/published/archived)
- views: 浏览量
- authorId: 作者ID
- publishedAt: 发布时间
- tags: 标签数组

### Comment (评论)
- id: 主键
- content: 内容
- articleId: 文章ID
- userId: 用户ID
- parentId: 父评论ID (可为空)
- status: 状态 (pending/approved/rejected)
- likes: 点赞数

### Blessing (祝福)
- id: 主键
- content: 内容
- userId: 用户ID
- authorName: 作者姓名
- graduationYear: 毕业年份
- department: 院系
- status: 状态 (pending/approved/rejected)
- likes: 点赞数
- isAnonymous: 是否匿名

### User (用户)
- id: 主键
- username: 用户名
- email: 邮箱
- password: 密码 (加密存储)
- avatar: 头像URL
- bio: 个人简介
- graduationYear: 毕业年份
- department: 院系
- role: 角色 (user/admin) - 默认为 user

---

## 新增优化说明 ⭐

### 评论/留言优化
1. **新增取消点赞功能**: 用户可以通过 `DELETE /api/v1/comments/:id/like` 取消对评论的点赞
2. **防止点赞数为负**: 取消点赞时会检查点赞数，确保不会出现负数
3. **支持二级评论**: 通过 `parentId` 参数支持评论回复功能
4. **权限控制**: 只有评论作者或管理员可以删除评论

### 祝福优化
1. **新增取消点赞功能**: 用户可以通过 `DELETE /api/v1/blessings/:id/like` 取消对祝福的点赞
2. **防止点赞数为负**: 取消点赞时会检查点赞数，确保不会出现负数
3. **匿名祝福支持**: 用户可以选择匿名发表祝福
4. **随机祝福接口**: 支持随机获取祝福用于展示
5. **权限控制**: 只有祝福作者或管理员可以修改/删除祝福

---

## 注意事项

1. 所有需要登录的接口都需要在请求头中携带 `Authorization: Bearer {token}`
2. 管理员接口额外需要用户角色为 `admin`
3. 分页参数: `page` (页码,从1开始) 和 `limit` (每页数量)
4. 评论支持两级结构:顶级评论和回复
5. 祝福和评论都支持审核机制,默认状态为 `approved`
6. 匿名祝福不会显示用户信息，authorName 显示为"匿名校友"
7. 点赞/取消点赞操作需要登录认证

---

## 5. 访客统计接口 (/api/v1/visitors) ⭐新增

### 5.1 增加访客量
```http
POST /api/v1/visitors/add
Content-Type: application/json

{
  "sessionId": "可选,客户端生成的唯一会话ID"
}
```
**响应:**
```json
{
  "success": true,
  "message": "访客记录成功",
  "data": {
    "isNewVisitor": true,
    "sessionId": "生成的会话ID",
    "visitorNumber": 12345
  }
}
```
**说明:**
- 无需登录即可调用
- 如果不提供sessionId，系统会自动生成一个UUID
- 同一个sessionId只会计数一次
- visitorNumber表示用户是第几位传承者

### 5.2 获取访客总数
```http
GET /api/v1/visitors/count
```
**响应:**
```json
{
  "success": true,
  "data": {
    "totalVisitors": 12345
  }
}
```
**说明:**
- 无需登录即可调用
- 用于首页展示"你是第xxx个传承者"

### 5.3 获取访客统计（管理员）
```http
GET /api/v1/visitors/stats
Authorization: Bearer {admin_token}
```
**响应:**
```json
{
  "success": true,
  "data": {
    "totalVisitors": 12345,
    "todayVisitors": 150,
    "weekVisitors": 890,
    "monthVisitors": 3500
  }
}
```
**说明:**
- 需要管理员权限
- 提供今日、本周、本月的访客统计

---

## 6. 寄语未来接口 (/api/v1/future-messages) ⭐新增

### 6.1 创建寄语
```http
POST /api/v1/future-messages
Content-Type: application/json
Authorization: Bearer {token}  // 可选,支持未登录用户

{
  "name": "张三",
  "grade": "2018级水利工程",
  "message": "祝河海大学110周年生日快乐！百年树人，薪火相传..."
}
```
**响应:**
```json
{
  "success": true,
  "message": "您的誓言已成功点亮星火！",
  "data": {
    "id": 1,
    "name": "张三",
    "grade": "2018级水利工程",
    "message": "祝河海大学110周年生日快乐！百年树人，薪火相传...",
    "createdAt": "2024-10-20T12:00:00.000Z"
  }
}
```
**说明:**
- 无需登录即可调用（支持optionalAuth）
- 如果用户已登录，会记录userId
- message字段最多500字
- grade支持格式: "2018级水利工程" 或 "河海校友"

### 6.2 获取寄语列表
```http
GET /api/v1/future-messages?page=1&limit=20&sort=latest
```
**查询参数:**
- page: 页码（默认1）
- limit: 每页数量（默认20）
- sort: 排序方式（latest=最新, random=随机）

**响应:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": 1,
        "name": "张三",
        "grade": "2018级水利工程",
        "message": "祝河海大学110周年生日快乐！...",
        "createdAt": "2024-10-20T12:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "totalPages": 5
    }
  }
}
```

### 6.3 获取随机寄语
```http
GET /api/v1/future-messages/random?limit=5
```
**响应:**
```json
{
  "success": true,
  "data": {
    "messages": [...]
  }
}
```
**说明:**
- 用于在页面上随机展示寄语
- limit默认为5条

### 6.4 获取单条寄语详情
```http
GET /api/v1/future-messages/:id
```
**响应:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "张三",
    "grade": "2018级水利工程",
    "message": "祝河海大学110周年生日快乐！...",
    "createdAt": "2024-10-20T12:00:00.000Z"
  }
}
```

### 6.5 获取所有寄语（管理员）
```http
GET /api/v1/future-messages/admin/all?page=1&limit=20&status=pending
Authorization: Bearer {admin_token}
```
**查询参数:**
- page: 页码
- limit: 每页数量
- status: 审核状态（pending/approved/rejected）- 可选

**响应:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": 1,
        "name": "张三",
        "grade": "2018级水利工程",
        "message": "...",
        "status": "approved",
        "ipAddress": "192.168.1.1",
        "userId": 2,
        "user": {
          "id": 2,
          "username": "testuser",
          "email": "test@hohai.edu.cn"
        },
        "createdAt": "2024-10-20T12:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "totalPages": 5
    }
  }
}
```

### 6.6 审核寄语（管理员）
```http
PUT /api/v1/future-messages/admin/:id/review
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "approved"  // 或 "rejected"
}
```
**响应:**
```json
{
  "success": true,
  "message": "审核成功",
  "data": {
    "id": 1,
    "status": "approved",
    ...
  }
}
```

### 6.7 删除寄语（管理员）
```http
DELETE /api/v1/future-messages/admin/:id
Authorization: Bearer {admin_token}
```
**响应:**
```json
{
  "success": true,
  "message": "寄语删除成功"
}
```

---

## 新增数据模型 ⭐

### Visitor (访客记录)
- id: 主键
- sessionId: 会话ID（唯一标识）
- ipAddress: IP地址
- userAgent: 用户代理信息
- visitTime: 访问时间
- createdAt: 创建时间
- updatedAt: 更新时间

### FutureMessage (寄语未来)
- id: 主键
- name: 姓名
- grade: 届别/单位（如: "2018级水利工程" 或 "河海校友"）
- message: 誓言内容（最多500字）
- status: 审核状态 (pending/approved/rejected)
- ipAddress: IP地址
- userAgent: 用户代理信息
- userId: 用户ID（可为空，支持未登录用户）
- createdAt: 创建时间
- updatedAt: 更新时间

---

## 使用场景说明 ⭐

### 访客统计功能
**前端实现建议:**
1. 用户首次访问网站时，在localStorage中检查是否有sessionId
2. 如果没有，调用 `POST /api/v1/visitors/add` 获取新的sessionId和访客编号
3. 将sessionId保存到localStorage
4. 在首页显示"你是第xxx个传承者"
5. 后续访问时使用保存的sessionId再次调用，系统不会重复计数

```javascript
// 示例代码
let sessionId = localStorage.getItem('visitorSessionId');
const response = await fetch('/api/v1/visitors/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ sessionId })
});
const data = await response.json();
if (data.data.isNewVisitor) {
  localStorage.setItem('visitorSessionId', data.data.sessionId);
}
// 显示: "你是第 {data.data.visitorNumber} 个传承者"
```

### 寄语未来功能
**页面布局:**
1. **表单区域:**
   - 姓名输入框
   - 届别/单位输入框（placeholder: "如: 2018级水利工程 或 河海校友"）
   - 誓言输入框（多行文本，最多500字，显示字数统计）
   - "点亮星火"提交按钮

2. **展示区域:**
   - 显示已审核通过的寄语列表
   - 支持分页或无限滚动
   - 可以随机展示部分寄语作为星空效果

3. **无需登录:**
   - 任何访客都可以提交寄语
   - 提交后立即显示（默认自动审核通过）
   - 如果需要审核，可在后台将status改为'pending'

---

## 7. 火炬接口 (/api/v1/torch) ⭐新增

### 7.1 增加火炬数量
```http
POST /api/v1/torch/add
Content-Type: application/json

{
  "count": 1  // 可选，默认为1，必须为正整数
}
```
**响应:**
```json
{
  "code": 200,
  "message": "火炬数量增加成功",
  "data": {
    "count": 12346
  }
}
```
**说明:**
- 无需登录即可调用
- count 参数可选，默认为1
- count 必须为正整数
- 返回增加后的总数量

### 7.2 获取火炬数量
```http
GET /api/v1/torch/get
```
**响应:**
```json
{
  "code": 200,
  "message": "获取火炬数量成功",
  "data": {
    "count": 12346
  }
}
```
**说明:**
- 无需登录即可调用
- 返回当前火炬总数量
- 如果没有记录，会自动创建并返回0

---

## 更新数据模型 ⭐

### Torch (火炬)
- id: 主键（固定为1，全局唯一记录）
- count: 火炬数量
- createdAt: 创建时间
- updatedAt: 更新时间

---

## 使用场景说明 ⭐

### 火炬传递功能
**前端实现建议:**
1. 页面加载时调用 `GET /api/v1/torch/get` 获取当前火炬数量并显示
2. 用户点击传递火炬按钮时，调用 `POST /api/v1/torch/add` 增加火炬数量
3. 可以传递 count 参数一次增加多个（如果有特殊活动）
4. 实时更新页面显示的火炬数量

```javascript
// 示例代码：获取火炬数量
const getTorchCount = async () => {
  const response = await fetch('/api/v1/torch/get');
  const data = await response.json();
  console.log(`当前火炬数量: ${data.data.count}`);
  return data.data.count;
};

// 示例代码：传递火炬
const passTorch = async (count = 1) => {
  const response = await fetch('/api/v1/torch/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ count })
  });
  const data = await response.json();
  console.log(`火炬传递成功！当前总数: ${data.data.count}`);
  return data.data.count;
};
```

---

## 8. 论坛接口 (/api/v1/forum) ⭐新增

论坛功能提供板块管理、帖子发表、回复互动和点赞等完整的社区讨论功能。

### 8.1 板块管理

#### 8.1.1 获取所有论坛板块
```http
GET /api/v1/forum/forums?status=active
```
**查询参数:**
- status: 板块状态 (active/archived) - 可选

**响应:**
```json
{
  "code": 200,
  "message": "获取论坛板块成功",
  "data": {
    "forums": [
      {
        "id": 1,
        "name": "校庆话题",
        "description": "分享你对河海110周年校庆的感想和期待",
        "icon": "https://example.com/icons/celebration.png",
        "order": 1,
        "status": "active",
        "postCount": 156,
        "replyCount": 892,
        "createdAt": "2024-10-20T12:00:00.000Z"
      }
    ]
  }
}
```

#### 8.1.2 获取单个板块详情
```http
GET /api/v1/forum/forums/:id
```

#### 8.1.3 创建板块（管理员）
```http
POST /api/v1/forum/forums
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "学术交流",
  "description": "学术研究与交流讨论",
  "icon": "https://example.com/icons/academic.png",
  "order": 3
}
```

#### 8.1.4 更新板块（管理员）
```http
PUT /api/v1/forum/forums/:id
Authorization: Bearer {admin_token}
```

#### 8.1.5 删除板块（管理员）
```http
DELETE /api/v1/forum/forums/:id
Authorization: Bearer {admin_token}
```

### 8.2 帖子管理

#### 8.2.1 获取帖子列表
```http
GET /api/v1/forum/posts?forumId=1&page=1&limit=20&sort=latest&status=approved&search=关键词
```
**查询参数:**
- forumId: 板块ID - 可选
- page: 页码 (默认1)
- limit: 每页数量 (默认20)
- sort: 排序方式 (latest/hot/top/active)
- status: 帖子状态
- search: 搜索关键词

**响应:**
```json
{
  "code": 200,
  "message": "获取帖子列表成功",
  "data": {
    "posts": [{
      "id": 1,
      "title": "河海110周年,让我们一起回忆那些难忘的时光",
      "content": "作为2018级的学生...",
      "isSticky": true,
      "views": 1234,
      "likes": 89,
      "replyCount": 45,
      "user": {
        "id": 2,
        "username": "张三",
        "avatar": "https://example.com/avatar.jpg"
      }
    }],
    "pagination": {
      "total": 156,
      "page": 1,
      "limit": 20,
      "totalPages": 8
    }
  }
}
```

#### 8.2.2 获取帖子详情
```http
GET /api/v1/forum/posts/:id
```
**说明:** 访问会自动增加浏览次数,登录用户可获取点赞状态

#### 8.2.3 创建帖子（需登录）
```http
POST /api/v1/forum/posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "forumId": 1,
  "title": "我的河海时光",
  "content": "在河海度过的四年...",
  "images": ["https://example.com/img1.jpg"]
}
```

#### 8.2.4 更新帖子（作者或管理员）
```http
PUT /api/v1/forum/posts/:id
Authorization: Bearer {token}
```

#### 8.2.5 删除帖子（作者或管理员）
```http
DELETE /api/v1/forum/posts/:id
Authorization: Bearer {token}
```

### 8.3 回复管理

#### 8.3.1 获取帖子回复列表
```http
GET /api/v1/forum/posts/:postId/replies?page=1&limit=20&sort=asc
```
**响应:**
```json
{
  "code": 200,
  "message": "获取回复列表成功",
  "data": {
    "replies": [{
      "id": 1,
      "content": "说得好！我也是2018级的",
      "floor": 1,
      "likes": 12,
      "isLiked": false,
      "user": {
        "id": 3,
        "username": "李四"
      },
      "childReplies": [...]
    }],
    "pagination": {
      "total": 45,
      "page": 1
    }
  }
}
```

#### 8.3.2 创建回复（需登录）
```http
POST /api/v1/forum/posts/:postId/replies
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "我也很怀念那段时光",
  "parentId": null,
  "replyToUserId": null
}
```

#### 8.3.3 删除回复（作者或管理员）
```http
DELETE /api/v1/forum/replies/:id
Authorization: Bearer {token}
```

### 8.4 点赞功能

#### 8.4.1 点赞帖子或回复
```http
POST /api/v1/forum/:targetType/:targetId/like
Authorization: Bearer {token}
```
**示例:** 
- `POST /api/v1/forum/post/1/like` - 点赞帖子
- `POST /api/v1/forum/reply/5/like` - 点赞回复

#### 8.4.2 取消点赞
```http
DELETE /api/v1/forum/:targetType/:targetId/like
Authorization: Bearer {token}
```

### 8.5 管理员功能

#### 8.5.1 置顶/取消置顶帖子
```http
PUT /api/v1/forum/posts/:id/sticky
Authorization: Bearer {admin_token}
```

#### 8.5.2 加精/取消加精
```http
PUT /api/v1/forum/posts/:id/highlight
Authorization: Bearer {admin_token}
```

#### 8.5.3 锁定/解锁帖子
```http
PUT /api/v1/forum/posts/:id/lock
Authorization: Bearer {admin_token}
```

#### 8.5.4 审核帖子
```http
PUT /api/v1/forum/posts/:id/review
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "approved"
}
```

#### 8.5.5 审核回复
```http
PUT /api/v1/forum/replies/:id/review
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "approved"
}
```

---

## 论坛数据模型 ⭐

### Forum (论坛板块)
- id: 主键
- name: 板块名称
- description: 板块描述
- icon: 板块图标URL
- order: 排序顺序
- status: 板块状态 (active/archived)
- postCount: 帖子总数
- replyCount: 回复总数

### ForumPost (论坛帖子)
- id: 主键
- forumId: 所属板块ID
- userId: 发帖用户ID
- title: 帖子标题
- content: 帖子内容
- images: 图片URLs数组
- isSticky: 是否置顶
- isHighlighted: 是否加精
- status: 帖子状态 (pending/approved/rejected/locked)
- views: 浏览次数
- likes: 点赞数
- replyCount: 回复数量
- lastReplyAt: 最后回复时间
- lastReplyUserId: 最后回复用户ID

### ForumReply (论坛回复)
- id: 主键
- postId: 所属帖子ID
- userId: 回复用户ID
- content: 回复内容
- images: 图片URLs数组
- parentId: 父回复ID (楼中楼)
- replyToUserId: 被回复的用户ID
- status: 回复状态 (pending/approved/rejected)
- likes: 点赞数
- floor: 楼层号 (仅顶级回复)

### ForumLike (论坛点赞记录)
- id: 主键
- userId: 点赞用户ID
- targetType: 点赞目标类型 (post/reply)
- targetId: 点赞目标ID

---

## 论坛功能特点 ⭐

1. **多板块管理**: 支持创建多个讨论板块,按主题分类
2. **帖子发表**: 用户可以发表图文帖子,支持富文本内容
3. **楼层回复**: 支持顶级回复(楼层)和楼中楼(嵌套回复)
4. **点赞互动**: 对帖子和回复进行点赞
5. **管理功能**: 置顶、加精、锁定、审核等管理功能
6. **灵活排序**: 支持最新、热门、活跃、精华等多种排序
7. **搜索功能**: 支持关键词搜索帖子

### 权限说明
- **游客**: 可浏览板块、帖子和回复
- **登录用户**: 可发帖、回复、点赞,可编辑/删除自己的内容
- **管理员**: 拥有所有权限,包括板块管理、置顶、加精、锁定、审核等
