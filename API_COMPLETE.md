# API接口文档 - 完整版

## 目录
- [0. 认证接口](#0-认证接口)
- [1. 文章接口](#1-文章接口)
- [2. 评论/留言接口](#2-评论留言接口)
- [3. 祝福接口](#3-祝福接口)
- [4. 管理员接口](#4-管理员接口)
- [9. 用户接口](#9-用户接口) ⭐新增完善
- [10. 系统配置接口](#10-系统配置接口) ⭐新增

---

## 0. 认证接口 (/api/v1/auth)

### 0.0 查询注册状态 ⭐新增
```http
GET /api/v1/auth/registration-status
```
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
**说明:**
- 无需登录即可调用
- 用于前端判断是否显示注册入口
- 管理员可通过后台配置开关注册功能

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
**说明:**
- 当注册功能关闭时，会返回403错误
- 错误信息："系统当前不允许新用户注册"

### 0.2 用户登录
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

### 0.3 Token刷新
```http
POST /api/v1/auth/refresh
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

## 9. 用户接口 (/api/v1/users) ⭐新增完善

### 9.1 获取个人信息
```http
GET /api/v1/users/profile
Authorization: Bearer {token}
```
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

### 9.2 更新个人信息
```http
PUT /api/v1/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "newusername",
  "bio": "新的个人简介",
  "avatar": "https://example.com/new-avatar.jpg",
  "graduationYear": 2021,
  "department": "水利学院"
}
```
**说明:**
- 只能修改username、bio、avatar、graduationYear、department
- 用户名不能与其他用户重复

### 9.3 修改密码 ⭐新增
```http
PUT /api/v1/users/password
Authorization: Bearer {token}
Content-Type: application/json

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
**说明:**
- 需要提供旧密码验证
- 新密码至少6位

### 9.4 发送邮箱验证码 ⭐新增
```http
POST /api/v1/users/email/send-code
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "newemail@example.com",
  "type": "email_change"
}
```
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
**说明:**
- type 可选值: "email_verification", "email_change"
- 验证码有效期15分钟
- 1分钟内只能发送一次

### 9.5 更换邮箱 ⭐新增
```http
PUT /api/v1/users/email
Authorization: Bearer {token}
Content-Type: application/json

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
**说明:**
- 需要先调用发送验证码接口
- 新邮箱不能已被其他用户使用

### 9.6 忘记密码 - 发送验证码 ⭐新增
```http
POST /api/v1/users/forgot-password
Content-Type: application/json

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
**说明:**
- 无需登录
- 为安全考虑，不透露邮箱是否存在
- 1分钟内只能发送一次

### 9.7 重置密码 ⭐新增
```http
POST /api/v1/users/reset-password
Content-Type: application/json

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
**说明:**
- 无需登录
- 需要先调用忘记密码接口获取验证码
- 新密码至少6位

---

## 4. 管理员接口 (/api/v1/admin) ⭐已扩展
**所有管理员接口都需要管理员权限**

### 4.1 获取统计数据
```http
GET /api/v1/admin/stats
Authorization: Bearer {admin_token}
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
  "status": "approved"
}
```

### 4.4 审核祝福
```http
PUT /api/v1/admin/blessings/:id/review
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "approved"
}
```

### 4.5 获取用户列表
```http
GET /api/v1/admin/users?page=1&limit=20&search=关键词
Authorization: Bearer {admin_token}
```
**响应:**
```json
{
  "code": 200,
  "message": "获取用户列表成功",
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
    "total": 100,
    "page": 1,
    "totalPages": 5
  }
}
```

### 4.6 添加用户 ⭐新增
```http
POST /api/v1/admin/users
Authorization: Bearer {admin_token}
Content-Type: application/json

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
**响应:**
```json
{
  "code": 201,
  "message": "用户创建成功",
  "data": {
    "id": 10,
    "username": "newuser",
    "email": "newuser@example.com",
    "role": "user",
    ...
  }
}
```
**说明:**
- username、email、password为必填项
- role默认为"user"，可选"admin"
- 用户名和邮箱不能重复

### 4.7 修改用户角色 ⭐新增
```http
PUT /api/v1/admin/users/:id/role
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "role": "admin"
}
```
**响应:**
```json
{
  "code": 200,
  "message": "用户角色修改成功",
  "data": {
    "id": 10,
    "username": "newuser",
    "role": "admin",
    ...
  }
}
```
**说明:**
- role可选值: "user", "admin"
- 不能修改自己的角色

### 4.8 编辑用户信息 ⭐新增
```http
PUT /api/v1/admin/users/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "username": "updateduser",
  "email": "updated@example.com",
  "password": "newpassword123",
  "avatar": "https://example.com/new-avatar.jpg",
  "bio": "更新的简介",
  "graduationYear": 2021,
  "department": "水利学院"
}
```
**响应:**
```json
{
  "code": 200,
  "message": "用户信息更新成功",
  "data": {
    "id": 10,
    "username": "updateduser",
    ...
  }
}
```
**说明:**
- 所有字段都是可选的
- 如果修改username或email，会检查是否已被使用
- 如果提供password，将自动加密

### 4.9 删除单个用户
```http
DELETE /api/v1/admin/users/:id
Authorization: Bearer {admin_token}
```
**响应:**
```json
{
  "code": 200,
  "message": "用户删除成功"
}
```
**说明:**
- 不能删除自己的账号

### 4.10 批量删除用户 ⭐新增
```http
POST /api/v1/admin/users/batch-delete
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "ids": [10, 11, 12, 13]
}
```
**响应:**
```json
{
  "code": 200,
  "message": "成功删除 4 个用户",
  "data": {
    "deletedCount": 4
  }
}
```
**说明:**
- ids必须是数组
- 会自动过滤掉自己的ID，防止误删
- 返回实际删除的数量

### 4.11 批量删除内容
```http
POST /api/v1/admin/batch-delete
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "type": "comment",
  "ids": [1, 2, 3, 4, 5]
}
```
**说明:**
- type可选值: "comment", "blessing", "article"

---

## 10. 系统配置接口 (/api/v1/admin/configs) ⭐新增
**所有系统配置接口都需要管理员权限**

### 10.1 获取所有系统配置
```http
GET /api/v1/admin/configs
Authorization: Bearer {admin_token}
```
**响应:**
```json
{
  "code": 200,
  "message": "获取配置列表成功",
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
**说明:**
- SMTP配置中的密码会被隐藏为"******"

### 10.2 获取单个系统配置
```http
GET /api/v1/admin/configs/:key
Authorization: Bearer {admin_token}
```
**示例:**
```http
GET /api/v1/admin/configs/registration_enabled
```
**响应:**
```json
{
  "code": 200,
  "message": "获取配置成功",
  "data": {
    "key": "registration_enabled",
    "value": true,
    "description": "是否允许新用户注册"
  }
}
```

### 10.3 设置注册开关
```http
PUT /api/v1/admin/configs/registration
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "enabled": false
}
```
**响应:**
```json
{
  "code": 200,
  "message": "用户注册已关闭",
  "data": {
    "enabled": false
  }
}
```
**说明:**
- enabled必须是布尔值
- true表示允许注册，false表示禁止注册
- 关闭后，用户调用注册接口会收到403错误

### 10.4 设置SMTP配置
```http
PUT /api/v1/admin/configs/smtp
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "host": "smtp.gmail.com",
  "port": 587,
  "secure": false,
  "user": "your-email@gmail.com",
  "password": "your-app-password",
  "fromName": "河海大学110周年校庆"
}
```
**响应:**
```json
{
  "code": 200,
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
**说明:**
- host、user、password为必填项
- port默认为587
- secure默认为false
- fromName默认为"河海大学110周年校庆"
- 保存后会自动测试SMTP连接
- 常见SMTP配置:
  - Gmail: smtp.gmail.com:587 (需要应用专用密码)
  - QQ邮箱: smtp.qq.com:587 (需要授权码)
  - 163邮箱: smtp.163.com:465 (secure: true)
  - 阿里云邮箱: smtp.aliyun.com:465 (secure: true)

### 10.5 测试SMTP连接
```http
POST /api/v1/admin/configs/smtp/test
Authorization: Bearer {admin_token}
```
**响应:**
```json
{
  "code": 200,
  "message": "SMTP连接测试成功",
  "data": {
    "success": true,
    "message": "SMTP连接测试成功"
  }
}
```
**说明:**
- 测试当前配置的SMTP服务器是否可用
- 如果配置未设置或连接失败，会返回错误信息

---

## 新增数据模型 ⭐

### SystemConfig (系统配置)
- id: 主键
- key: 配置键名（唯一）
- value: 配置值（JSON格式）
- description: 配置描述
- createdAt: 创建时间
- updatedAt: 更新时间

**预定义配置键:**
- `registration_enabled`: 是否允许新用户注册 (boolean)
- `smtp_config`: SMTP邮件服务器配置 (object)

### VerificationCode (验证码)
- id: 主键
- email: 邮箱地址
- code: 验证码（6位数字）
- type: 验证码类型 (email_verification/password_reset/email_change)
- expiresAt: 过期时间
- used: 是否已使用
- ipAddress: 请求IP地址
- createdAt: 创建时间
- updatedAt: 更新时间

---

## 邮件功能说明 ⭐

### 邮件验证码用途
1. **邮箱验证** (email_verification): 验证用户邮箱有效性
2. **密码重置** (password_reset): 忘记密码时重置密码
3. **邮箱更换** (email_change): 更换绑定邮箱

### 验证码特性
- 6位数字验证码
- 有效期15分钟
- 1分钟内只能发送一次（防止滥用）
- 使用后自动失效
- 过期后自动失效

### 邮件模板
系统会发送精美的HTML邮件，包含:
- 标题和说明
- 大字号验证码
- 有效期提醒
- 安全提示
- 品牌标识

---

## 权限说明 ⭐

### 接口权限分类
1. **公开接口** - 无需登录
   - 查询注册状态
   - 用户注册/登录
   - 忘记密码/重置密码
   - 查看文章、祝福等公开内容

2. **用户接口** - 需要登录
   - 修改个人信息
   - 修改密码
   - 更换邮箱
   - 发表评论、祝福等

3. **管理员接口** - 需要管理员权限
   - 用户管理（增删改查、修改角色）
   - 内容审核
   - 系统配置管理
   - 批量操作

### 权限验证流程
1. 检查Authorization header中的token
2. 验证token有效性
3. 检查用户角色（user/admin）
4. 根据接口要求判断是否有权限

---

## 错误码说明

### HTTP状态码
- 200: 成功
- 201: 创建成功
- 400: 请求参数错误
- 401: 未授权（未登录或token无效）
- 403: 禁止访问（权限不足）
- 404: 资源不存在
- 409: 冲突（如用户名/邮箱已存在）
- 429: 请求过于频繁
- 500: 服务器内部错误

### 常见错误信息
- "用户名已存在"
- "邮箱已存在"
- "旧密码不正确"
- "验证码无效或已过期"
- "请求过于频繁，请稍后再试"
- "系统当前不允许新用户注册"
- "SMTP配置未设置或不完整"
- "权限不足"

---

## 使用场景示例

### 场景1：用户忘记密码
1. 用户点击"忘记密码"
2. 前端调用 `POST /api/v1/users/forgot-password` 发送验证码
3. 用户收到邮件，输入验证码和新密码
4. 前端调用 `POST /api/v1/users/reset-password` 重置密码
5. 提示用户密码重置成功，引导登录

### 场景2：用户更换邮箱
1. 用户进入个人设置页面
2. 输入新邮箱，点击"发送验证码"
3. 前端调用 `POST /api/v1/users/email/send-code`
4. 用户收到邮件，输入验证码
5. 前端调用 `PUT /api/v1/users/email` 更换邮箱
6. 提示用户邮箱更换成功

### 场景3：管理员关闭注册
1. 管理员登录后台管理系统
2. 进入系统配置页面
3. 调用 `PUT /api/v1/admin/configs/registration` 设置enabled为false
4. 前端首页调用 `GET /api/v1/auth/registration-status` 检查状态
5. 根据状态隐藏或显示注册入口

### 场景4：管理员配置SMTP
1. 管理员进入系统配置页面
2. 填写SMTP服务器信息
3. 调用 `PUT /api/v1/admin/configs/smtp` 保存配置
4. 系统自动测试SMTP连接
5. 显示测试结果，如果成功则保存

---

## 安全建议

### 密码安全
- 密码使用bcrypt加密存储
- 最小长度6位（建议8位以上）
- 不在响应中返回密码字段

### Token安全
- 使用JWT token进行身份验证
- token有过期时间
- 提供refresh token机制
- 敏感操作需要重新验证

### 邮件安全
- 验证码有效期限制
- 发送频率限制
- 使用后自动失效
- 记录IP地址防止滥用

### API安全
- 所有管理接口需要admin权限
- 批量操作需要额外验证
- 防止删除自己的账号
- 敏感配置信息脱敏显示

---

## 开发提示

### 前端开发建议
1. 使用axios或fetch进行API调用
2. 全局配置Authorization header
3. 实现token刷新机制
4. 统一错误处理
5. 显示友好的错误提示

### 测试建议
1. 使用Postman或类似工具测试API
2. 先注册一个管理员账号用于测试
3. 配置SMTP后测试邮件功能
4. 测试各种边界情况和错误场景

### 部署建议
1. 设置环境变量（数据库、JWT密钥等）
2. 配置SMTP服务器
3. 启用HTTPS
4. 配置CORS允许的域名
5. 设置合理的速率限制

---

**文档版本:** v2.0
**更新日期:** 2025-10-22
**更新内容:** 新增用户管理、系统配置、邮件验证等完整功能
