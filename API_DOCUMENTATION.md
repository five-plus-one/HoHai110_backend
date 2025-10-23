# 河海大学110周年校庆网站 - API接口文档

**版本:** v2.0
**更新日期:** 2025-10-22
**基础URL:** `http://your-domain.com/api/v1`

---

## 目录

- [1. 概述](#1-概述)
- [2. 认证机制](#2-认证机制)
- [3. 响应格式](#3-响应格式)
- [4. 错误处理](#4-错误处理)
- [5. API接口](#5-api接口)
  - [5.1 认证接口](#51-认证接口)
  - [5.2 用户接口](#52-用户接口)
  - [5.3 文章接口](#53-文章接口)
  - [5.4 评论接口](#54-评论接口)
  - [5.5 祝福接口](#55-祝福接口)
  - [5.6 访客统计接口](#56-访客统计接口)
  - [5.7 寄语未来接口](#57-寄语未来接口)
  - [5.8 火炬传递接口](#58-火炬传递接口)
  - [5.9 时间线接口](#59-时间线接口)
  - [5.10 接力活动接口](#510-接力活动接口)
  - [5.11 格言接口](#511-格言接口)
  - [5.12 论坛接口](#512-论坛接口)
  - [5.13 管理员接口](#513-管理员接口)
  - [5.14 系统配置接口](#514-系统配置接口)
  - [5.15 统计接口](#515-统计接口)
  - [5.16 文件上传接口](#516-文件上传接口)
- [6. 数据模型](#6-数据模型)
- [7. 速率限制](#7-速率限制)
- [8. 使用示例](#8-使用示例)

---

## 1. 概述

河海大学110周年校庆网站后端API提供了完整的功能支持，包括用户认证、内容管理、互动功能、社区论坛等。本文档详细描述了所有可用的API接口。

### 技术栈

- **框架:** Express 5.x
- **数据库:** MySQL 8.0+
- **ORM:** Sequelize 6.x
- **认证:** JWT (JSON Web Token)
- **实时通信:** Socket.IO 4.x

### 特性

- RESTful API 设计
- JWT Token 认证
- 角色权限控制 (user/admin)
- 请求速率限制
- 统一错误处理
- CORS 跨域支持

---

## 2. 认证机制

### 认证方式

API使用 JWT (JSON Web Token) 进行身份验证。

### 获取Token

通过登录或注册接口获取 Token：

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
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "role": "user"
    }
  }
}
```

### 使用Token

在需要认证的请求中，在请求头中添加 Token：

```http
Authorization: Bearer {token}
```

### Token刷新

Token 过期后可使用 Refresh Token 获取新的 Token：

```http
POST /api/v1/auth/refresh
Authorization: Bearer {refresh_token}
```

### 权限等级

- **公开接口:** 无需登录
- **用户接口:** 需要登录 (role: user 或 admin)
- **管理员接口:** 需要管理员权限 (role: admin)

---

## 3. 响应格式

### 成功响应

```json
{
  "success": true,
  "message": "操作成功",
  "data": {
    // 响应数据
  }
}
```

### 分页响应

```json
{
  "success": true,
  "message": "获取列表成功",
  "data": {
    "items": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "totalPages": 5
    }
  }
}
```

---

## 4. 错误处理

### 错误响应格式

```json
{
  "success": false,
  "message": "错误描述信息",
  "code": 400,
  "errors": [
    {
      "field": "email",
      "message": "邮箱格式不正确"
    }
  ]
}
```

### HTTP状态码

| 状态码 | 说明 |
|-------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/Token无效 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

### 常见错误码

| 错误码 | 错误信息 |
|-------|---------|
| AUTH_001 | Token无效或已过期 |
| AUTH_002 | 权限不足 |
| USER_001 | 用户名已存在 |
| USER_002 | 邮箱已存在 |
| USER_003 | 用户不存在 |
| VALIDATION_001 | 请求参数验证失败 |
| RATE_LIMIT_001 | 请求过于频繁 |

---

## 5. API接口

### 5.1 认证接口

#### 5.1.1 查询注册状态

**接口:** `GET /api/v1/auth/registration-status`
**权限:** 公开

**描述:** 查询系统是否允许新用户注册

**响应:**
```json
{
  "success": true,
  "message": "获取注册状态成功",
  "data": {
    "enabled": true
  }
}
```

---

#### 5.1.2 用户注册

**接口:** `POST /api/v1/auth/register`
**权限:** 公开

**请求体:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**字段说明:**

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| username | string | 是 | 用户名，3-20字符 |
| email | string | 是 | 邮箱地址 |
| password | string | 是 | 密码，至少6位 |
| confirmPassword | string | 是 | 确认密码 |

**响应:**
```json
{
  "success": true,
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

**错误响应:**
```json
{
  "success": false,
  "message": "系统当前不允许新用户注册",
  "code": 403
}
```

---

#### 5.1.3 用户登录

**接口:** `POST /api/v1/auth/login`
**权限:** 公开

**请求体:**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**响应:**
```json
{
  "success": true,
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

---

#### 5.1.4 Token刷新

**接口:** `POST /api/v1/auth/refresh`
**权限:** 需要 Refresh Token

**请求头:**
```
Authorization: Bearer {refresh_token}
```

**响应:**
```json
{
  "success": true,
  "message": "Token刷新成功",
  "data": {
    "token": "new_jwt_token_string",
    "refreshToken": "new_refresh_token_string"
  }
}
```

---

### 5.2 用户接口

#### 5.2.1 获取个人信息

**接口:** `GET /api/v1/users/profile`
**权限:** 需要登录

**响应:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "个人简介",
    "graduationYear": 2020,
    "department": "计算机学院",
    "joinedActivities": 5,
    "contributions": {
      "maxims": 10,
      "relayParticipations": 3,
      "mosaicCompleted": 2
    }
  }
}
```

---

#### 5.2.2 更新个人信息

**接口:** `PUT /api/v1/users/profile`
**权限:** 需要登录

**请求体:**
```json
{
  "username": "newusername",
  "bio": "新的个人简介",
  "avatar": "https://example.com/new-avatar.jpg",
  "graduationYear": 2021,
  "department": "水利学院"
}
```

**响应:**
```json
{
  "success": true,
  "message": "个人信息更新成功",
  "data": {
    "id": 1,
    "username": "newusername",
    "email": "test@example.com",
    "avatar": "https://example.com/new-avatar.jpg",
    "bio": "新的个人简介",
    "graduationYear": 2021,
    "department": "水利学院"
  }
}
```

---

#### 5.2.3 修改密码

**接口:** `PUT /api/v1/users/password`
**权限:** 需要登录

**请求体:**
```json
{
  "oldPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**响应:**
```json
{
  "success": true,
  "message": "密码修改成功"
}
```

---

#### 5.2.4 发送邮箱验证码

**接口:** `POST /api/v1/users/email/send-code`
**权限:** 需要登录

**请求体:**
```json
{
  "email": "newemail@example.com",
  "type": "email_change"
}
```

**字段说明:**

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| email | string | 是 | 邮箱地址 |
| type | string | 是 | 验证码类型: email_verification, email_change |

**响应:**
```json
{
  "success": true,
  "message": "验证码已发送到您的邮箱",
  "data": {
    "email": "newemail@example.com",
    "expiresIn": 900
  }
}
```

---

#### 5.2.5 更换邮箱

**接口:** `PUT /api/v1/users/email`
**权限:** 需要登录

**请求体:**
```json
{
  "newEmail": "newemail@example.com",
  "code": "123456"
}
```

**响应:**
```json
{
  "success": true,
  "message": "邮箱更换成功",
  "data": {
    "email": "newemail@example.com"
  }
}
```

---

#### 5.2.6 忘记密码 - 发送验证码

**接口:** `POST /api/v1/users/forgot-password`
**权限:** 公开

**请求体:**
```json
{
  "email": "test@example.com"
}
```

**响应:**
```json
{
  "success": true,
  "message": "如果该邮箱已注册，重置链接将发送到您的邮箱"
}
```

---

#### 5.2.7 重置密码

**接口:** `POST /api/v1/users/reset-password`
**权限:** 公开

**请求体:**
```json
{
  "email": "test@example.com",
  "code": "123456",
  "newPassword": "newpassword456"
}
```

**响应:**
```json
{
  "success": true,
  "message": "密码重置成功"
}
```

---

### 5.3 文章接口

#### 5.3.1 获取文章列表

**接口:** `GET /api/v1/articles`
**权限:** 公开

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页数量，默认10 |
| category | string | 否 | 分类筛选 |
| status | string | 否 | 状态筛选: draft/published/archived |

**请求示例:**
```http
GET /api/v1/articles?page=1&limit=10&category=校庆动态&status=published
```

**响应:**
```json
{
  "success": true,
  "message": "获取文章列表成功",
  "data": {
    "articles": [
      {
        "id": 1,
        "title": "河海大学110周年校庆启动仪式",
        "summary": "文章摘要",
        "coverImage": "https://example.com/cover.jpg",
        "category": "校庆动态",
        "views": 1234,
        "author": {
          "id": 2,
          "username": "admin",
          "avatar": "https://example.com/avatar.jpg"
        },
        "publishedAt": "2024-10-20T12:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}
```

---

#### 5.3.2 获取文章详情

**接口:** `GET /api/v1/articles/:id`
**权限:** 公开

**响应:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "河海大学110周年校庆启动仪式",
    "content": "文章完整内容...",
    "summary": "文章摘要",
    "coverImage": "https://example.com/cover.jpg",
    "category": "校庆动态",
    "status": "published",
    "views": 1235,
    "tags": ["校庆", "活动"],
    "author": {
      "id": 2,
      "username": "admin",
      "avatar": "https://example.com/avatar.jpg"
    },
    "publishedAt": "2024-10-20T12:00:00.000Z",
    "createdAt": "2024-10-19T10:00:00.000Z",
    "updatedAt": "2024-10-20T12:00:00.000Z"
  }
}
```

---

#### 5.3.3 创建文章

**接口:** `POST /api/v1/articles`
**权限:** 需要登录

**请求体:**
```json
{
  "title": "文章标题",
  "content": "文章内容",
  "summary": "文章摘要",
  "coverImage": "https://example.com/cover.jpg",
  "category": "校庆动态",
  "status": "published",
  "tags": ["标签1", "标签2"]
}
```

**响应:**
```json
{
  "success": true,
  "message": "文章创建成功",
  "data": {
    "id": 10,
    "title": "文章标题",
    ...
  }
}
```

---

#### 5.3.4 更新文章

**接口:** `PUT /api/v1/articles/:id`
**权限:** 需要登录（作者或管理员）

**请求体:** 同创建文章

---

#### 5.3.5 删除文章

**接口:** `DELETE /api/v1/articles/:id`
**权限:** 需要登录（作者或管理员）

**响应:**
```json
{
  "success": true,
  "message": "文章删除成功"
}
```

---

### 5.4 评论接口

#### 5.4.1 获取评论列表

**接口:** `GET /api/v1/comments/article/:articleId`
**权限:** 公开

**查询参数:**
- page: 页码
- limit: 每页数量

**响应:**
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": 1,
        "content": "评论内容",
        "likes": 10,
        "user": {
          "id": 3,
          "username": "张三",
          "avatar": "https://example.com/avatar.jpg"
        },
        "replies": [
          {
            "id": 2,
            "content": "回复内容",
            "user": {...}
          }
        ],
        "createdAt": "2024-10-20T12:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 20,
      "totalPages": 3
    }
  }
}
```

---

#### 5.4.2 发表评论

**接口:** `POST /api/v1/comments/article/:articleId`
**权限:** 需要登录

**请求体:**
```json
{
  "content": "评论内容",
  "parentId": null
}
```

**字段说明:**
- content: 评论内容（必填）
- parentId: 父评论ID，回复评论时提供（可选）

**响应:**
```json
{
  "success": true,
  "message": "评论发表成功",
  "data": {
    "id": 10,
    "content": "评论内容",
    "articleId": 1,
    "userId": 3,
    "parentId": null,
    "status": "approved",
    "likes": 0,
    "createdAt": "2024-10-22T10:00:00.000Z"
  }
}
```

---

#### 5.4.3 删除评论

**接口:** `DELETE /api/v1/comments/:id`
**权限:** 需要登录（作者或管理员）

---

#### 5.4.4 点赞评论

**接口:** `POST /api/v1/comments/:id/like`
**权限:** 需要登录

**响应:**
```json
{
  "success": true,
  "message": "点赞成功",
  "data": {
    "likes": 11
  }
}
```

---

#### 5.4.5 取消点赞

**接口:** `DELETE /api/v1/comments/:id/like`
**权限:** 需要登录

**响应:**
```json
{
  "success": true,
  "message": "取消点赞成功",
  "data": {
    "likes": 10
  }
}
```

---

### 5.5 祝福接口

#### 5.5.1 获取祝福列表

**接口:** `GET /api/v1/blessings`
**权限:** 公开

**查询参数:**
- page: 页码
- limit: 每页数量
- status: 状态筛选

**响应:**
```json
{
  "success": true,
  "data": {
    "blessings": [
      {
        "id": 1,
        "content": "祝河海大学110周年生日快乐！",
        "authorName": "张三",
        "graduationYear": 2020,
        "department": "计算机学院",
        "likes": 15,
        "isAnonymous": false,
        "createdAt": "2024-10-20T12:00:00.000Z"
      }
    ],
    "pagination": {...}
  }
}
```

---

#### 5.5.2 获取随机祝福

**接口:** `GET /api/v1/blessings/random`
**权限:** 公开

**查询参数:**
- limit: 返回数量，默认5

---

#### 5.5.3 发表祝福

**接口:** `POST /api/v1/blessings`
**权限:** 需要登录

**请求体:**
```json
{
  "content": "祝河海大学110周年生日快乐！",
  "isAnonymous": false
}
```

**响应:**
```json
{
  "success": true,
  "message": "祝福发表成功",
  "data": {
    "id": 20,
    "content": "祝河海大学110周年生日快乐！",
    "authorName": "张三",
    "graduationYear": 2020,
    "department": "计算机学院",
    "isAnonymous": false,
    "status": "approved",
    "likes": 0
  }
}
```

---

#### 5.5.4 更新祝福

**接口:** `PUT /api/v1/blessings/:id`
**权限:** 需要登录（作者或管理员）

---

#### 5.5.5 删除祝福

**接口:** `DELETE /api/v1/blessings/:id`
**权限:** 需要登录（作者或管理员）

---

#### 5.5.6 点赞祝福

**接口:** `POST /api/v1/blessings/:id/like`
**权限:** 需要登录

---

#### 5.5.7 取消点赞祝福

**接口:** `DELETE /api/v1/blessings/:id/like`
**权限:** 需要登录

---

### 5.6 访客统计接口

#### 5.6.1 增加访客记录

**接口:** `POST /api/v1/visitors/add`
**权限:** 公开

**请求体:**
```json
{
  "sessionId": "optional-unique-session-id"
}
```

**响应:**
```json
{
  "success": true,
  "message": "访客记录成功",
  "data": {
    "isNewVisitor": true,
    "sessionId": "generated-or-provided-session-id",
    "visitorNumber": 12345
  }
}
```

**说明:**
- sessionId可选，不提供时系统自动生成UUID
- 同一sessionId只计数一次
- visitorNumber表示用户是第几位传承者

---

#### 5.6.2 获取访客总数

**接口:** `GET /api/v1/visitors/count`
**权限:** 公开

**响应:**
```json
{
  "success": true,
  "data": {
    "totalVisitors": 12345
  }
}
```

---

#### 5.6.3 获取访客统计（管理员）

**接口:** `GET /api/v1/visitors/stats`
**权限:** 管理员

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

---

### 5.7 寄语未来接口

#### 5.7.1 创建寄语

**接口:** `POST /api/v1/future-messages`
**权限:** 公开（可选登录）

**请求体:**
```json
{
  "name": "张三",
  "grade": "2018级水利工程",
  "message": "祝河海大学110周年生日快乐！百年树人，薪火相传..."
}
```

**字段说明:**

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| name | string | 是 | 姓名 |
| grade | string | 是 | 届别/单位 |
| message | string | 是 | 誓言内容，最多500字 |

**响应:**
```json
{
  "success": true,
  "message": "您的誓言已成功点亮星火！",
  "data": {
    "id": 1,
    "name": "张三",
    "grade": "2018级水利工程",
    "message": "祝河海大学110周年生日快乐！...",
    "createdAt": "2024-10-20T12:00:00.000Z"
  }
}
```

---

#### 5.7.2 获取寄语列表

**接口:** `GET /api/v1/future-messages`
**权限:** 公开

**查询参数:**
- page: 页码
- limit: 每页数量
- sort: 排序方式（latest=最新, random=随机）

---

#### 5.7.3 获取随机寄语

**接口:** `GET /api/v1/future-messages/random`
**权限:** 公开

**查询参数:**
- limit: 返回数量，默认5

---

#### 5.7.4 获取寄语详情

**接口:** `GET /api/v1/future-messages/:id`
**权限:** 公开

---

#### 5.7.5 获取所有寄语（管理员）

**接口:** `GET /api/v1/future-messages/admin/all`
**权限:** 管理员

---

#### 5.7.6 审核寄语（管理员）

**接口:** `PUT /api/v1/future-messages/admin/:id/review`
**权限:** 管理员

**请求体:**
```json
{
  "status": "approved"
}
```

---

#### 5.7.7 删除寄语（管理员）

**接口:** `DELETE /api/v1/future-messages/admin/:id`
**权限:** 管理员

---

### 5.8 火炬传递接口

#### 5.8.1 增加火炬数量

**接口:** `POST /api/v1/torch/add`
**权限:** 公开

**请求体:**
```json
{
  "count": 1
}
```

**字段说明:**
- count: 增加的数量，默认1，必须为正整数

**响应:**
```json
{
  "success": true,
  "message": "火炬数量增加成功",
  "data": {
    "count": 12346
  }
}
```

---

#### 5.8.2 获取火炬数量

**接口:** `GET /api/v1/torch/get`
**权限:** 公开

**响应:**
```json
{
  "success": true,
  "message": "获取火炬数量成功",
  "data": {
    "count": 12346
  }
}
```

---

### 5.9 时间线接口

#### 5.9.1 获取时间线事件列表

**接口:** `GET /api/v1/timeline/events`
**权限:** 公开

**查询参数:**
- year: 年份筛选
- category: 分类筛选（milestone/achievement/event）
- page: 页码
- pageSize: 每页数量

**响应:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": 1,
        "year": 1915,
        "month": 3,
        "day": 15,
        "title": "河海工程专门学校成立",
        "description": "详细描述...",
        "category": "milestone",
        "images": ["https://example.com/image.jpg"]
      }
    ],
    "pagination": {...}
  }
}
```

---

#### 5.9.2 获取事件详情

**接口:** `GET /api/v1/timeline/events/:eventId`
**权限:** 公开

---

### 5.10 接力活动接口

#### 5.10.1 获取接力活动列表

**接口:** `GET /api/v1/relay/activities`
**权限:** 公开

**查询参数:**
- page: 页码
- pageSize: 每页数量
- status: 状态筛选（ongoing/upcoming/ended）

---

#### 5.10.2 参与接力活动

**接口:** `POST /api/v1/relay/participate`
**权限:** 需要登录

**请求体:**
```json
{
  "activityId": 1,
  "content": "分享内容",
  "images": ["url1", "url2"],
  "video": "video_url"
}
```

---

#### 5.10.3 获取活动参与者

**接口:** `GET /api/v1/relay/activities/:activityId/participants`
**权限:** 公开

---

### 5.11 格言接口

#### 5.11.1 获取格言列表

**接口:** `GET /api/v1/maxims`
**权限:** 公开

**查询参数:**
- page: 页码
- pageSize: 每页数量
- sort: 排序方式（newest/hot/random）

**响应:**
```json
{
  "success": true,
  "data": {
    "maxims": [
      {
        "id": 1,
        "content": "艰苦朴素，实事求是，严格要求，勇于探索",
        "author": "张三",
        "category": "学习",
        "likes": 25,
        "isLiked": false,
        "user": {
          "id": 3,
          "username": "张三",
          "avatar": "https://example.com/avatar.jpg"
        },
        "createdAt": "2024-10-20T12:00:00.000Z"
      }
    ],
    "pagination": {...}
  }
}
```

---

#### 5.11.2 提交格言

**接口:** `POST /api/v1/maxims`
**权限:** 需要登录

**请求体:**
```json
{
  "content": "格言内容",
  "author": "作者",
  "category": "学习"
}
```

---

#### 5.11.3 点赞格言

**接口:** `POST /api/v1/maxims/:maximId/like`
**权限:** 需要登录

---

#### 5.11.4 取消点赞

**接口:** `DELETE /api/v1/maxims/:maximId/like`
**权限:** 需要登录

---

### 5.12 论坛接口

#### 5.12.1 获取论坛板块列表

**接口:** `GET /api/v1/forum/forums`
**权限:** 公开

**查询参数:**
- status: 板块状态（active/archived）

**响应:**
```json
{
  "success": true,
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

---

#### 5.12.2 获取帖子列表

**接口:** `GET /api/v1/forum/posts`
**权限:** 公开

**查询参数:**
- forumId: 板块ID
- page: 页码
- limit: 每页数量
- sort: 排序方式（latest/hot/top/active）
- status: 帖子状态
- search: 搜索关键词

**响应:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "河海110周年,让我们一起回忆那些难忘的时光",
        "content": "作为2018级的学生...",
        "isSticky": true,
        "isHighlighted": false,
        "status": "approved",
        "views": 1234,
        "likes": 89,
        "replyCount": 45,
        "images": ["https://example.com/image.jpg"],
        "user": {
          "id": 2,
          "username": "张三",
          "avatar": "https://example.com/avatar.jpg"
        },
        "lastReplyAt": "2024-10-22T08:00:00.000Z",
        "createdAt": "2024-10-20T12:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 156,
      "page": 1,
      "limit": 20,
      "totalPages": 8
    }
  }
}
```

---

#### 5.12.3 获取帖子详情

**接口:** `GET /api/v1/forum/posts/:id`
**权限:** 公开

**说明:** 访问会自动增加浏览次数

---

#### 5.12.4 创建帖子

**接口:** `POST /api/v1/forum/posts`
**权限:** 需要登录

**请求体:**
```json
{
  "forumId": 1,
  "title": "我的河海时光",
  "content": "在河海度过的四年...",
  "images": ["https://example.com/img1.jpg"]
}
```

---

#### 5.12.5 更新帖子

**接口:** `PUT /api/v1/forum/posts/:id`
**权限:** 需要登录（作者或管理员）

---

#### 5.12.6 删除帖子

**接口:** `DELETE /api/v1/forum/posts/:id`
**权限:** 需要登录（作者或管理员）

---

#### 5.12.7 获取帖子回复列表

**接口:** `GET /api/v1/forum/posts/:postId/replies`
**权限:** 公开

**查询参数:**
- page: 页码
- limit: 每页数量
- sort: 排序方式（asc/desc）

**响应:**
```json
{
  "success": true,
  "data": {
    "replies": [
      {
        "id": 1,
        "content": "说得好！我也是2018级的",
        "floor": 1,
        "likes": 12,
        "isLiked": false,
        "images": [],
        "user": {
          "id": 3,
          "username": "李四",
          "avatar": "https://example.com/avatar.jpg"
        },
        "childReplies": [
          {
            "id": 2,
            "content": "握手！同级同学",
            "parentId": 1,
            "user": {...}
          }
        ],
        "createdAt": "2024-10-21T10:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 20
    }
  }
}
```

---

#### 5.12.8 创建回复

**接口:** `POST /api/v1/forum/posts/:postId/replies`
**权限:** 需要登录

**请求体:**
```json
{
  "content": "我也很怀念那段时光",
  "parentId": null,
  "replyToUserId": null,
  "images": []
}
```

**字段说明:**
- content: 回复内容（必填）
- parentId: 父回复ID，楼中楼时提供（可选）
- replyToUserId: 被回复的用户ID（可选）
- images: 图片URL数组（可选）

---

#### 5.12.9 删除回复

**接口:** `DELETE /api/v1/forum/replies/:id`
**权限:** 需要登录（作者或管理员）

---

#### 5.12.10 点赞帖子/回复

**接口:** `POST /api/v1/forum/:targetType/:targetId/like`
**权限:** 需要登录

**路径参数:**
- targetType: 目标类型（post/reply）
- targetId: 目标ID

**示例:**
- `POST /api/v1/forum/post/1/like` - 点赞帖子
- `POST /api/v1/forum/reply/5/like` - 点赞回复

---

#### 5.12.11 取消点赞

**接口:** `DELETE /api/v1/forum/:targetType/:targetId/like`
**权限:** 需要登录

---

#### 5.12.12 置顶/取消置顶帖子（管理员）

**接口:** `PUT /api/v1/forum/posts/:id/sticky`
**权限:** 管理员

---

#### 5.12.13 加精/取消加精（管理员）

**接口:** `PUT /api/v1/forum/posts/:id/highlight`
**权限:** 管理员

---

#### 5.12.14 锁定/解锁帖子（管理员）

**接口:** `PUT /api/v1/forum/posts/:id/lock`
**权限:** 管理员

---

#### 5.12.15 审核帖子（管理员）

**接口:** `PUT /api/v1/forum/posts/:id/review`
**权限:** 管理员

**请求体:**
```json
{
  "status": "approved"
}
```

---

#### 5.12.16 审核回复（管理员）

**接口:** `PUT /api/v1/forum/replies/:id/review`
**权限:** 管理员

---

### 5.13 管理员接口

#### 5.13.1 获取统计数据

**接口:** `GET /api/v1/admin/stats`
**权限:** 管理员

**响应:**
```json
{
  "success": true,
  "data": {
    "users": 1000,
    "articles": 50,
    "blessings": 200,
    "comments": 500,
    "maxims": 150,
    "relayParticipations": 80,
    "forumPosts": 156,
    "forumReplies": 892
  }
}
```

---

#### 5.13.2 获取待审核内容

**接口:** `GET /api/v1/admin/pending`
**权限:** 管理员

**响应:**
```json
{
  "success": true,
  "data": {
    "comments": [...],
    "blessings": [...],
    "forumPosts": [...],
    "forumReplies": [...]
  }
}
```

---

#### 5.13.3 获取用户列表

**接口:** `GET /api/v1/admin/users`
**权限:** 管理员

**查询参数:**
- page: 页码
- limit: 每页数量
- search: 搜索关键词

**响应:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "role": "user",
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

---

#### 5.13.4 添加用户

**接口:** `POST /api/v1/admin/users`
**权限:** 管理员

**请求体:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "user",
  "avatar": "https://example.com/avatar.jpg",
  "bio": "个人简介",
  "graduationYear": 2020,
  "department": "计算机学院"
}
```

---

#### 5.13.5 修改用户角色

**接口:** `PUT /api/v1/admin/users/:id/role`
**权限:** 管理员

**请求体:**
```json
{
  "role": "admin"
}
```

**说明:** 不能修改自己的角色

---

#### 5.13.6 编辑用户信息

**接口:** `PUT /api/v1/admin/users/:id`
**权限:** 管理员

---

#### 5.13.7 删除用户

**接口:** `DELETE /api/v1/admin/users/:id`
**权限:** 管理员

**说明:** 不能删除自己的账号

---

#### 5.13.8 批量删除用户

**接口:** `POST /api/v1/admin/users/batch-delete`
**权限:** 管理员

**请求体:**
```json
{
  "ids": [10, 11, 12, 13]
}
```

**响应:**
```json
{
  "success": true,
  "message": "成功删除 4 个用户",
  "data": {
    "deletedCount": 4
  }
}
```

---

#### 5.13.9 批量删除内容

**接口:** `POST /api/v1/admin/batch-delete`
**权限:** 管理员

**请求体:**
```json
{
  "type": "comment",
  "ids": [1, 2, 3, 4, 5]
}
```

**字段说明:**
- type: 内容类型（comment/blessing/article）

---

#### 5.13.10 审核评论

**接口:** `PUT /api/v1/admin/comments/:id/review`
**权限:** 管理员

**请求体:**
```json
{
  "status": "approved"
}
```

---

#### 5.13.11 审核祝福

**接口:** `PUT /api/v1/admin/blessings/:id/review`
**权限:** 管理员

---

### 5.14 系统配置接口

#### 5.14.1 获取所有配置

**接口:** `GET /api/v1/admin/configs`
**权限:** 管理员

**响应:**
```json
{
  "success": true,
  "data": [
    {
      "key": "registration_enabled",
      "value": true,
      "description": "是否允许新用户注册"
    },
    {
      "key": "smtp_config",
      "value": {
        "host": "smtp.example.com",
        "port": 587,
        "secure": false,
        "user": "noreply@example.com",
        "password": "******",
        "fromName": "河海大学110周年校庆"
      },
      "description": "SMTP邮件服务器配置"
    }
  ]
}
```

---

#### 5.14.2 获取单个配置

**接口:** `GET /api/v1/admin/configs/:key`
**权限:** 管理员

---

#### 5.14.3 设置注册开关

**接口:** `PUT /api/v1/admin/configs/registration`
**权限:** 管理员

**请求体:**
```json
{
  "enabled": false
}
```

**响应:**
```json
{
  "success": true,
  "message": "用户注册已关闭",
  "data": {
    "enabled": false
  }
}
```

---

#### 5.14.4 设置SMTP配置

**接口:** `PUT /api/v1/admin/configs/smtp`
**权限:** 管理员

**请求体:**
```json
{
  "host": "smtp.gmail.com",
  "port": 587,
  "secure": false,
  "user": "your-email@gmail.com",
  "password": "your-app-password",
  "fromName": "河海大学110周年校庆"
}
```

**字段说明:**

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| host | string | 是 | SMTP服务器地址 |
| port | number | 否 | 端口，默认587 |
| secure | boolean | 否 | 是否使用SSL，默认false |
| user | string | 是 | 邮箱用户名 |
| password | string | 是 | 邮箱密码或授权码 |
| fromName | string | 否 | 发件人名称 |

**响应:**
```json
{
  "success": true,
  "message": "SMTP配置已保存",
  "data": {
    "config": {
      "host": "smtp.gmail.com",
      "port": 587,
      "secure": false,
      "user": "your-email@gmail.com",
      "password": "******",
      "fromName": "河海大学110周年校庆"
    },
    "testResult": {
      "success": true,
      "message": "SMTP连接测试成功"
    }
  }
}
```

**常见SMTP配置:**
- **Gmail:** smtp.gmail.com:587 (需要应用专用密码)
- **QQ邮箱:** smtp.qq.com:587 (需要授权码)
- **163邮箱:** smtp.163.com:465 (secure: true)
- **阿里云邮箱:** smtp.aliyun.com:465 (secure: true)

---

#### 5.14.5 测试SMTP连接

**接口:** `POST /api/v1/admin/configs/smtp/test`
**权限:** 管理员

**响应:**
```json
{
  "success": true,
  "message": "SMTP连接测试成功",
  "data": {
    "success": true,
    "message": "SMTP连接测试成功"
  }
}
```

---

### 5.15 统计接口

#### 5.15.1 获取整体统计

**接口:** `GET /api/v1/statistics/overview`
**权限:** 公开

**响应:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1000,
    "totalVisitors": 12345,
    "totalBlessings": 500,
    "totalMaxims": 300,
    "totalForumPosts": 156,
    "totalArticles": 50
  }
}
```

---

### 5.16 文件上传接口

#### 5.16.1 上传媒体文件

**接口:** `POST /api/v1/upload/media`
**权限:** 需要登录

**请求体:** multipart/form-data

**字段:**
- file: 文件（必填）

**限制:**
- 文件大小: 最大10MB
- 支持类型: 图片（jpg, jpeg, png, gif）、视频（mp4, avi, mov）

**响应:**
```json
{
  "success": true,
  "message": "文件上传成功",
  "data": {
    "url": "https://your-domain.com/uploads/1234567890-filename.jpg",
    "filename": "1234567890-filename.jpg",
    "mimetype": "image/jpeg",
    "size": 1024000
  }
}
```

---

## 6. 数据模型

### User (用户)

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | integer | 主键 |
| username | string | 用户名，唯一 |
| email | string | 邮箱，唯一 |
| password | string | 密码（加密存储） |
| avatar | string | 头像URL |
| bio | text | 个人简介 |
| graduationYear | integer | 毕业年份 |
| department | string | 院系 |
| role | enum | 角色：user/admin |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |

---

### Article (文章)

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | integer | 主键 |
| title | string | 标题 |
| content | text | 内容 |
| summary | text | 摘要 |
| coverImage | string | 封面图片 |
| category | string | 分类 |
| status | enum | 状态：draft/published/archived |
| views | integer | 浏览量 |
| authorId | integer | 作者ID |
| publishedAt | datetime | 发布时间 |
| tags | json | 标签数组 |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |

---

### Comment (评论)

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | integer | 主键 |
| content | text | 内容 |
| articleId | integer | 文章ID |
| userId | integer | 用户ID |
| parentId | integer | 父评论ID |
| status | enum | 状态：pending/approved/rejected |
| likes | integer | 点赞数 |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |

---

### Blessing (祝福)

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | integer | 主键 |
| content | text | 内容 |
| userId | integer | 用户ID |
| authorName | string | 作者姓名 |
| graduationYear | integer | 毕业年份 |
| department | string | 院系 |
| status | enum | 状态：pending/approved/rejected |
| likes | integer | 点赞数 |
| isAnonymous | boolean | 是否匿名 |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |

---

### Visitor (访客记录)

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | integer | 主键 |
| sessionId | string | 会话ID，唯一 |
| ipAddress | string | IP地址 |
| userAgent | string | 用户代理 |
| visitTime | datetime | 访问时间 |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |

---

### FutureMessage (寄语未来)

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | integer | 主键 |
| name | string | 姓名 |
| grade | string | 届别/单位 |
| message | text | 誓言内容（最多500字） |
| status | enum | 状态：pending/approved/rejected |
| ipAddress | string | IP地址 |
| userAgent | string | 用户代理 |
| userId | integer | 用户ID（可为空） |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |

---

### Torch (火炬)

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | integer | 主键（固定为1） |
| count | integer | 火炬数量 |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |

---

### TimelineEvent (时间线事件)

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | integer | 主键 |
| year | integer | 年份 |
| month | integer | 月份 |
| day | integer | 日期 |
| title | string | 标题 |
| description | text | 描述 |
| category | enum | 分类：milestone/achievement/event |
| images | json | 图片数组 |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |

---

### RelayActivity (接力活动)

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | integer | 主键 |
| title | string | 标题 |
| description | text | 描述 |
| startTime | datetime | 开始时间 |
| endTime | datetime | 结束时间 |
| status | enum | 状态：ongoing/upcoming/ended |
| participantCount | integer | 参与人数 |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |

---

### RelayParticipation (接力参与记录)

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | integer | 主键 |
| activityId | integer | 活动ID |
| userId | integer | 用户ID |
| content | text | 分享内容 |
| images | json | 图片数组 |
| video | string | 视频URL |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |

---

### Maxim (格言)

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | integer | 主键 |
| content | text | 内容 |
| author | string | 作者 |
| category | string | 分类 |
| userId | integer | 用户ID |
| likes | integer | 点赞数 |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |

---

### Forum (论坛板块)

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | integer | 主键 |
| name | string | 板块名称 |
| description | text | 板块描述 |
| icon | string | 板块图标URL |
| order | integer | 排序顺序 |
| status | enum | 状态：active/archived |
| postCount | integer | 帖子总数 |
| replyCount | integer | 回复总数 |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |

---

### ForumPost (论坛帖子)

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | integer | 主键 |
| forumId | integer | 所属板块ID |
| userId | integer | 发帖用户ID |
| title | string | 帖子标题 |
| content | text | 帖子内容 |
| images | json | 图片URLs数组 |
| isSticky | boolean | 是否置顶 |
| isHighlighted | boolean | 是否加精 |
| status | enum | 状态：pending/approved/rejected/locked |
| views | integer | 浏览次数 |
| likes | integer | 点赞数 |
| replyCount | integer | 回复数量 |
| lastReplyAt | datetime | 最后回复时间 |
| lastReplyUserId | integer | 最后回复用户ID |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |

---

### ForumReply (论坛回复)

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | integer | 主键 |
| postId | integer | 所属帖子ID |
| userId | integer | 回复用户ID |
| content | text | 回复内容 |
| images | json | 图片URLs数组 |
| parentId | integer | 父回复ID（楼中楼） |
| replyToUserId | integer | 被回复的用户ID |
| status | enum | 状态：pending/approved/rejected |
| likes | integer | 点赞数 |
| floor | integer | 楼层号（仅顶级回复） |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |

---

### SystemConfig (系统配置)

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | integer | 主键 |
| key | string | 配置键名，唯一 |
| value | json | 配置值 |
| description | text | 配置描述 |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |

**预定义配置键:**
- `registration_enabled`: 是否允许新用户注册 (boolean)
- `smtp_config`: SMTP邮件服务器配置 (object)

---

### VerificationCode (验证码)

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | integer | 主键 |
| email | string | 邮箱地址 |
| code | string | 验证码（6位数字） |
| type | enum | 类型：email_verification/password_reset/email_change |
| expiresAt | datetime | 过期时间 |
| used | boolean | 是否已使用 |
| ipAddress | string | 请求IP地址 |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |

---

## 7. 速率限制

### 全局限制

- **限制:** 100 请求/分钟/IP
- **适用:** 所有API接口

### 用户限制

- **限制:** 1000 请求/小时/用户
- **适用:** 需要登录的接口

### 认证限制

- **限制:** 5 次登录尝试/15分钟
- **适用:** 登录、注册接口

### 邮件发送限制

- **限制:** 1 次/分钟/邮箱
- **适用:** 发送验证码接口

### 响应头

当达到速率限制时，响应会包含以下头部信息：

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1634567890
Retry-After: 60
```

### 错误响应

```json
{
  "success": false,
  "message": "请求过于频繁，请稍后再试",
  "code": 429
}
```

---

## 8. 使用示例

### 8.1 用户注册和登录流程

```javascript
// 1. 检查注册是否开放
const checkRegistration = async () => {
  const response = await fetch('/api/v1/auth/registration-status');
  const data = await response.json();

  if (!data.data.enabled) {
    alert('系统当前不允许新用户注册');
    return false;
  }
  return true;
};

// 2. 注册用户
const register = async (username, email, password) => {
  const response = await fetch('/api/v1/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      email,
      password,
      confirmPassword: password
    })
  });

  const data = await response.json();

  if (data.success) {
    // 保存token
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));

    // 判断用户角色
    if (data.data.user.role === 'admin') {
      window.location.href = '/admin';
    } else {
      window.location.href = '/dashboard';
    }
  }
};

// 3. 登录
const login = async (username, password) => {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();

  if (data.success) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
};
```

---

### 8.2 访客统计实现

```javascript
// 页面加载时记录访客
const recordVisitor = async () => {
  // 从localStorage获取sessionId
  let sessionId = localStorage.getItem('visitorSessionId');

  const response = await fetch('/api/v1/visitors/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sessionId })
  });

  const data = await response.json();

  if (data.data.isNewVisitor) {
    // 保存新的sessionId
    localStorage.setItem('visitorSessionId', data.data.sessionId);
  }

  // 显示访客编号
  document.getElementById('visitor-number').textContent =
    `你是第 ${data.data.visitorNumber} 个传承者`;
};

// 页面加载时调用
recordVisitor();
```

---

### 8.3 火炬传递实现

```javascript
// 获取火炬数量
const getTorchCount = async () => {
  const response = await fetch('/api/v1/torch/get');
  const data = await response.json();

  // 更新页面显示
  document.getElementById('torch-count').textContent = data.data.count;

  return data.data.count;
};

// 传递火炬
const passTorch = async () => {
  const button = document.getElementById('pass-torch-button');
  button.disabled = true;

  const response = await fetch('/api/v1/torch/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ count: 1 })
  });

  const data = await response.json();

  if (data.success) {
    // 更新显示
    document.getElementById('torch-count').textContent = data.data.count;

    // 显示传递动画
    showTorchAnimation();

    // 重新启用按钮
    setTimeout(() => {
      button.disabled = false;
    }, 2000);
  }
};

// 页面加载时获取火炬数量
getTorchCount();
```

---

### 8.4 寄语未来实现

```javascript
// 提交寄语
const submitMessage = async (name, grade, message) => {
  // 字数验证
  if (message.length > 500) {
    alert('誓言内容不能超过500字');
    return;
  }

  const response = await fetch('/api/v1/future-messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, grade, message })
  });

  const data = await response.json();

  if (data.success) {
    alert('您的誓言已成功点亮星火！');

    // 清空表单
    document.getElementById('message-form').reset();

    // 刷新列表
    loadMessages();
  }
};

// 加载寄语列表
const loadMessages = async (page = 1) => {
  const response = await fetch(
    `/api/v1/future-messages?page=${page}&limit=20&sort=latest`
  );
  const data = await response.json();

  // 渲染列表
  renderMessages(data.data.messages);
  renderPagination(data.data.pagination);
};

// 字数统计
const messageInput = document.getElementById('message-input');
messageInput.addEventListener('input', (e) => {
  const length = e.target.value.length;
  document.getElementById('char-count').textContent = `${length}/500`;
});
```

---

### 8.5 论坛功能实现

```javascript
// 获取论坛板块列表
const getForums = async () => {
  const response = await fetch('/api/v1/forum/forums?status=active');
  const data = await response.json();

  // 渲染板块列表
  renderForums(data.data.forums);
};

// 获取帖子列表
const getPosts = async (forumId, page = 1, sort = 'latest') => {
  const response = await fetch(
    `/api/v1/forum/posts?forumId=${forumId}&page=${page}&limit=20&sort=${sort}`
  );
  const data = await response.json();

  // 渲染帖子列表
  renderPosts(data.data.posts);
  renderPagination(data.data.pagination);
};

// 发表帖子
const createPost = async (forumId, title, content, images) => {
  const token = localStorage.getItem('token');

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

  if (data.success) {
    // 跳转到帖子详情页
    window.location.href = `/forum/posts/${data.data.post.id}`;
  }
};

// 发表回复
const createReply = async (postId, content, parentId = null) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`/api/v1/forum/posts/${postId}/replies`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content, parentId })
  });

  const data = await response.json();

  if (data.success) {
    // 刷新回复列表
    loadReplies(postId);
  }
};

// 点赞/取消点赞
const toggleLike = async (targetType, targetId, isLiked) => {
  const token = localStorage.getItem('token');
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

  if (data.success) {
    // 更新UI
    updateLikeButton(targetId, !isLiked, data.data.likes);
  }
};
```

---

### 8.6 API请求封装

```javascript
// 创建一个通用的API请求函数
class API {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  // 获取token
  getToken() {
    return localStorage.getItem('token');
  }

  // 刷新token
  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${refreshToken}`
      }
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      return data.data.token;
    }

    // Token刷新失败，跳转到登录页
    window.location.href = '/login';
    return null;
  }

  // 通用请求方法
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    // 添加认证头
    if (token && !options.skipAuth) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      let response = await fetch(url, config);

      // Token过期，尝试刷新
      if (response.status === 401 && !options.skipAuth) {
        const newToken = await this.refreshToken();
        if (newToken) {
          config.headers['Authorization'] = `Bearer ${newToken}`;
          response = await fetch(url, config);
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '请求失败');
      }

      return data;
    } catch (error) {
      console.error('API请求错误:', error);
      throw error;
    }
  }

  // GET请求
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  // POST请求
  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  // PUT请求
  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  // DELETE请求
  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// 使用示例
const api = new API('http://your-domain.com/api/v1');

// 获取文章列表
const articles = await api.get('/articles?page=1&limit=10');

// 创建文章
const newArticle = await api.post('/articles', {
  title: '新文章',
  content: '内容...'
});

// 更新文章
const updated = await api.put('/articles/1', {
  title: '更新后的标题'
});

// 删除文章
await api.delete('/articles/1');
```

---

## 附录

### A. 开发环境设置

**环境变量配置 (.env):**

```env
PORT=3000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hohai110

# JWT配置
JWT_SECRET=your-secret-key-change-in-production

# 文件上传配置
UPLOAD_DIR=./uploads

# CORS配置
CORS_ORIGIN=http://localhost:3001
```

---

### B. 部署建议

1. **使用HTTPS:** 生产环境必须使用HTTPS加密通信
2. **配置域名:** 设置正确的CORS允许域名
3. **修改密钥:** 更改JWT_SECRET为安全的随机字符串
4. **数据库备份:** 定期备份数据库
5. **日志管理:** 配置日志收集和轮转
6. **监控告警:** 设置性能监控和错误告警
7. **负载均衡:** 使用Nginx或其他负载均衡器
8. **进程管理:** 使用PM2管理Node.js进程

---

### C. 常见问题

**Q: Token过期了怎么办？**
A: 使用Refresh Token调用 `/api/v1/auth/refresh` 接口获取新的Token。

**Q: 如何关闭用户注册？**
A: 管理员登录后，调用 `/api/v1/admin/configs/registration` 接口设置 `enabled: false`。

**Q: 忘记密码怎么办？**
A: 调用 `/api/v1/users/forgot-password` 发送验证码，然后使用 `/api/v1/users/reset-password` 重置密码。

**Q: 如何配置邮件服务？**
A: 管理员登录后，调用 `/api/v1/admin/configs/smtp` 接口配置SMTP服务器信息。

**Q: 上传文件大小限制是多少？**
A: 默认最大10MB，可在服务器配置中修改。

**Q: 如何获取管理员权限？**
A: 需要现有管理员通过 `/api/v1/admin/users/:id/role` 接口将用户角色修改为admin。

---

### D. 技术支持

- **项目仓库:** https://github.com/your-org/hohai110-backend
- **问题反馈:** https://github.com/your-org/hohai110-backend/issues
- **邮件联系:** support@example.com

---

**文档版本:** v2.0
**最后更新:** 2025-10-22
**维护团队:** Five Plus One Team

---

© 2025 河海大学110周年校庆. All rights reserved.
