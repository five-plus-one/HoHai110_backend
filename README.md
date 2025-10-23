# 河海大学110周年校庆网站 - 后端API

<div align="center">

![河海大学110周年](https://img.shields.io/badge/河海大学-110周年校庆-blue)
![Node.js](https://img.shields.io/badge/Node.js-14%2B-green)
![Express](https://img.shields.io/badge/Express-5.x-lightgrey)
![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-orange)
![License](https://img.shields.io/badge/license-GPL--3.0-blue)

[联系作者](https://r-l.ink/about)

[支持我一杯咖啡](https://r-l.ink/support)

**基于 Node.js + Express + MySQL 构建的校庆网站后端API服务**

[在线文档](#文档) · [快速开始](#快速开始) · [API接口](#api概览) · [部署指南](#部署)

</div>

---

## 📖 目录

- [项目简介](#项目简介)
- [核心功能](#核心功能)
- [技术栈](#技术栈)
- [系统架构](#系统架构)
- [快速开始](#快速开始)
- [API概览](#api概览)
- [数据库设计](#数据库设计)
- [实时通信](#实时通信)
- [安全特性](#安全特性)
- [部署](#部署)
- [文档](#文档)
- [开发团队](#开发团队)

---

## 项目简介

河海大学110周年校庆网站后端API是一个功能完整、安全可靠的后端服务系统，为校庆网站提供全方位的数据支持和业务逻辑处理。系统采用现代化的技术架构，支持用户认证、内容管理、社区互动、实时通信等多种功能。

### 项目特色

- ✅ **RESTful API 设计** - 遵循REST架构规范，接口清晰易用
- ✅ **完善的认证系统** - JWT Token认证，支持Token刷新机制
- ✅ **角色权限控制** - 用户/管理员分级权限管理
- ✅ **实时通信支持** - 基于Socket.IO的实时消息推送
- ✅ **邮件服务集成** - 支持邮箱验证、密码重置等功能
- ✅ **系统配置管理** - 灵活的后台配置系统
- ✅ **完整的社区功能** - 论坛、评论、点赞、祝福等互动功能
- ✅ **文件上传支持** - 图片、视频等媒体文件上传
- ✅ **速率限制保护** - 防止API滥用和恶意请求
- ✅ **统一错误处理** - 标准化的错误响应格式

---

## 核心功能

### 🔐 用户认证与管理

- **用户注册/登录** - 支持邮箱注册，密码加密存储
- **Token认证** - JWT Token + Refresh Token双token机制
- **密码管理** - 修改密码、忘记密码、邮箱验证
- **个人信息** - 用户资料管理、头像上传
- **权限控制** - 用户/管理员角色权限分离

### 📝 内容管理系统

- **文章系统** - 发布、编辑、删除文章，支持分类和标签
- **评论系统** - 文章评论、二级回复、点赞功能
- **祝福墙** - 用户祝福发表、展示、点赞
- **寄语未来** - 校友寄语征集与展示
- **时间线** - 学校历史事件展示

### 💬 社区互动功能

- **论坛系统** - 多板块论坛，支持发帖、回复、点赞
- **接力活动** - 校庆接力活动参与和分享
- **格言征集** - 用户格言提交与展示
- **火炬传递** - 全局火炬传递计数器
- **访客统计** - 网站访问量统计

### 🛡️ 管理员功能

- **用户管理** - 用户列表、添加、编辑、删除、角色管理
- **内容审核** - 评论、祝福、帖子等内容审核
- **系统配置** - 注册开关、SMTP配置等系统设置
- **数据统计** - 用户数、内容数等统计数据
- **批量操作** - 批量删除用户、内容等

---

## 技术栈

### 后端框架

- **Node.js** `14+` - JavaScript运行时
- **Express** `5.x` - Web应用框架
- **Sequelize** `6.x` - ORM框架
- **MySQL** `8.0+` - 关系型数据库

### 认证与安全

- **jsonwebtoken** `9.x` - JWT Token认证
- **bcryptjs** `3.x` - 密码加密
- **express-validator** `7.x` - 请求参数验证
- **express-rate-limit** `8.x` - 请求速率限制

### 实时通信

- **Socket.IO** `4.x` - WebSocket实时通信

### 邮件服务

- **nodemailer** `7.x` - 邮件发送

### 文件处理

- **multer** `2.x` - 文件上传处理

### 其他工具

- **cors** `2.x` - 跨域资源共享
- **dotenv** `17.x` - 环境变量管理
- **nodemon** `3.x` - 开发环境热重载

---

## 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                      前端应用                            │
│              (React / Vue / Angular)                    │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS + WebSocket
                     ↓
┌─────────────────────────────────────────────────────────┐
│                    Nginx 反向代理                        │
│              (负载均衡 + SSL终端)                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                  Express 应用服务器                       │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   路由层     │  │   中间件层    │  │   控制器层    │ │
│  │  (Routes)    │→│ (Middleware)  │→│ (Controllers) │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│         │                  │                  │         │
│         ↓                  ↓                  ↓         │
│  ┌──────────────────────────────────────────────────┐ │
│  │              业务逻辑层 (Services)                │ │
│  └──────────────────────────────────────────────────┘ │
│         │                                              │
│         ↓                                              │
│  ┌──────────────────────────────────────────────────┐ │
│  │           数据访问层 (Sequelize ORM)              │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                    MySQL 数据库                          │
│           (用户、文章、评论、祝福、论坛等)                 │
└─────────────────────────────────────────────────────────┘
```

### 项目结构

```
HoHai110_backend/
├── src/
│   ├── config/                  # 配置文件
│   │   ├── database.js         # 数据库连接配置
│   │   └── constants.js        # 常量定义
│   │
│   ├── models/                  # 数据模型 (21个)
│   │   ├── index.js            # 模型导出和关联
│   │   ├── User.js             # 用户模型
│   │   ├── Article.js          # 文章模型
│   │   ├── Comment.js          # 评论模型
│   │   ├── Blessing.js         # 祝福模型
│   │   ├── Visitor.js          # 访客记录模型
│   │   ├── FutureMessage.js    # 寄语未来模型
│   │   ├── Torch.js            # 火炬模型
│   │   ├── Forum.js            # 论坛板块模型
│   │   ├── ForumPost.js        # 论坛帖子模型
│   │   ├── ForumReply.js       # 论坛回复模型
│   │   ├── ForumLike.js        # 论坛点赞模型
│   │   ├── TimelineEvent.js    # 时间线事件模型
│   │   ├── RelayActivity.js    # 接力活动模型
│   │   ├── RelayParticipation.js  # 接力参与记录模型
│   │   ├── Maxim.js            # 格言模型
│   │   ├── MaximLike.js        # 格言点赞模型
│   │   ├── SystemConfig.js     # 系统配置模型
│   │   └── VerificationCode.js # 验证码模型
│   │
│   ├── controllers/             # 控制器 (15个)
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── articleController.js
│   │   ├── commentController.js
│   │   ├── blessingController.js
│   │   ├── visitorController.js
│   │   ├── futureMessageController.js
│   │   ├── torchController.js
│   │   ├── forumController.js
│   │   ├── timelineController.js
│   │   ├── relayController.js
│   │   ├── maximController.js
│   │   ├── adminController.js
│   │   ├── configController.js
│   │   ├── statisticsController.js
│   │   └── uploadController.js
│   │
│   ├── routes/                  # 路由 (16个)
│   │   ├── index.js            # 路由汇总
│   │   ├── auth.js             # 认证路由
│   │   ├── users.js            # 用户路由
│   │   ├── articles.js         # 文章路由
│   │   ├── comments.js         # 评论路由
│   │   ├── blessings.js        # 祝福路由
│   │   ├── visitors.js         # 访客路由
│   │   ├── futureMessages.js   # 寄语路由
│   │   ├── torch.js            # 火炬路由
│   │   ├── forum.js            # 论坛路由
│   │   ├── timeline.js         # 时间线路由
│   │   ├── relay.js            # 接力活动路由
│   │   ├── maxims.js           # 格言路由
│   │   ├── admin.js            # 管理员路由
│   │   ├── statistics.js       # 统计路由
│   │   └── upload.js           # 上传路由
│   │
│   ├── middleware/              # 中间件
│   │   ├── auth.js             # JWT认证中间件
│   │   ├── errorHandler.js    # 错误处理中间件
│   │   └── rateLimiter.js     # 速率限制中间件
│   │
│   ├── utils/                   # 工具函数
│   │   ├── jwt.js             # JWT工具
│   │   ├── response.js        # 响应格式化
│   │   └── email.js           # 邮件发送
│   │
│   ├── server.js               # 应用入口
│   └── sync-db.js              # 数据库同步脚本
│
├── uploads/                     # 文件上传目录
├── .env                         # 环境变量配置
├── .env.example                # 环境变量示例
├── .gitignore                  # Git忽略配置
├── package.json                # 项目依赖
├── README.md                   # 项目说明文档
├── API_DOCUMENTATION.md        # 完整API文档
├── QUICKSTART.md               # 快速开始指南
├── DEPLOY_CHECKLIST.md         # 部署检查清单
├── TROUBLESHOOTING.md          # 故障排查指南
└── ecosystem.config.js         # PM2配置文件
```

---

## 快速开始

### 环境要求

- **Node.js** >= 14.0.0
- **MySQL** >= 8.0.0
- **npm** >= 6.0.0

### 1. 克隆项目

```bash
git clone https://github.com/five-plus-one/HoHai110_backend.git
cd HoHai110_backend
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 文件并重命名为 `.env`，然后修改配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 服务器配置
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

### 4. 创建数据库

```bash
# 登录MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE hohai110 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 退出MySQL
exit
```

### 5. 同步数据库表结构

```bash
npm run sync-db
```

### 6. 启动服务

**开发模式（带热重载）：**

```bash
npm run dev
```

**生产模式：**

```bash
npm start
```

### 7. 验证安装

访问 `http://localhost:3000` 查看API服务状态。

如果看到以下响应，说明服务已成功启动：

```json
{
  "success": true,
  "message": "河海大学110周年校庆API服务运行中",
  "version": "1.0.0"
}
```

---

## API概览

### 接口统计

- **总接口数量:** 80+ 个
- **公开接口:** 30+ 个（无需登录）
- **用户接口:** 35+ 个（需要登录）
- **管理员接口:** 15+ 个（需要管理员权限）

### 接口分类

#### 🔐 认证接口 `/api/v1/auth`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/registration-status` | 查询注册状态 | 公开 |
| POST | `/register` | 用户注册 | 公开 |
| POST | `/login` | 用户登录 | 公开 |
| POST | `/refresh` | 刷新Token | Refresh Token |

#### 👤 用户接口 `/api/v1/users`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/profile` | 获取个人信息 | 用户 |
| PUT | `/profile` | 更新个人信息 | 用户 |
| PUT | `/password` | 修改密码 | 用户 |
| POST | `/email/send-code` | 发送邮箱验证码 | 用户 |
| PUT | `/email` | 更换邮箱 | 用户 |
| POST | `/forgot-password` | 忘记密码 | 公开 |
| POST | `/reset-password` | 重置密码 | 公开 |

#### 📝 文章接口 `/api/v1/articles`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/` | 获取文章列表 | 公开 |
| GET | `/:id` | 获取文章详情 | 公开 |
| POST | `/` | 创建文章 | 用户 |
| PUT | `/:id` | 更新文章 | 作者/管理员 |
| DELETE | `/:id` | 删除文章 | 作者/管理员 |

#### 💬 评论接口 `/api/v1/comments`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/article/:articleId` | 获取评论列表 | 公开 |
| POST | `/article/:articleId` | 发表评论 | 用户 |
| DELETE | `/:id` | 删除评论 | 作者/管理员 |
| POST | `/:id/like` | 点赞评论 | 用户 |
| DELETE | `/:id/like` | 取消点赞 | 用户 |

#### 🎊 祝福接口 `/api/v1/blessings`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/` | 获取祝福列表 | 公开 |
| GET | `/random` | 获取随机祝福 | 公开 |
| GET | `/:id` | 获取祝福详情 | 公开 |
| POST | `/` | 发表祝福 | 用户 |
| PUT | `/:id` | 更新祝福 | 作者/管理员 |
| DELETE | `/:id` | 删除祝福 | 作者/管理员 |
| POST | `/:id/like` | 点赞祝福 | 用户 |
| DELETE | `/:id/like` | 取消点赞 | 用户 |

#### 👥 访客统计接口 `/api/v1/visitors`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| POST | `/add` | 增加访客记录 | 公开 |
| GET | `/count` | 获取访客总数 | 公开 |
| GET | `/stats` | 获取访客统计 | 管理员 |

#### 📜 寄语未来接口 `/api/v1/future-messages`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| POST | `/` | 创建寄语 | 公开 |
| GET | `/` | 获取寄语列表 | 公开 |
| GET | `/random` | 获取随机寄语 | 公开 |
| GET | `/:id` | 获取寄语详情 | 公开 |
| GET | `/admin/all` | 获取所有寄语 | 管理员 |
| PUT | `/admin/:id/review` | 审核寄语 | 管理员 |
| DELETE | `/admin/:id` | 删除寄语 | 管理员 |

#### 🔥 火炬传递接口 `/api/v1/torch`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| POST | `/add` | 增加火炬数量 | 公开 |
| GET | `/get` | 获取火炬数量 | 公开 |

#### 📅 时间线接口 `/api/v1/timeline`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/events` | 获取事件列表 | 公开 |
| GET | `/events/:id` | 获取事件详情 | 公开 |

#### 🤝 接力活动接口 `/api/v1/relay`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/activities` | 获取活动列表 | 公开 |
| POST | `/participate` | 参与活动 | 用户 |
| GET | `/activities/:id/participants` | 获取参与者 | 公开 |

#### 💭 格言接口 `/api/v1/maxims`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/` | 获取格言列表 | 公开 |
| POST | `/` | 提交格言 | 用户 |
| POST | `/:id/like` | 点赞格言 | 用户 |
| DELETE | `/:id/like` | 取消点赞 | 用户 |

#### 🏛️ 论坛接口 `/api/v1/forum`

**板块管理:**

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/forums` | 获取板块列表 | 公开 |
| GET | `/forums/:id` | 获取板块详情 | 公开 |
| POST | `/forums` | 创建板块 | 管理员 |
| PUT | `/forums/:id` | 更新板块 | 管理员 |
| DELETE | `/forums/:id` | 删除板块 | 管理员 |

**帖子管理:**

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/posts` | 获取帖子列表 | 公开 |
| GET | `/posts/:id` | 获取帖子详情 | 公开 |
| POST | `/posts` | 创建帖子 | 用户 |
| PUT | `/posts/:id` | 更新帖子 | 作者/管理员 |
| DELETE | `/posts/:id` | 删除帖子 | 作者/管理员 |
| PUT | `/posts/:id/sticky` | 置顶帖子 | 管理员 |
| PUT | `/posts/:id/highlight` | 加精帖子 | 管理员 |
| PUT | `/posts/:id/lock` | 锁定帖子 | 管理员 |
| PUT | `/posts/:id/review` | 审核帖子 | 管理员 |

**回复管理:**

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/posts/:postId/replies` | 获取回复列表 | 公开 |
| POST | `/posts/:postId/replies` | 创建回复 | 用户 |
| DELETE | `/replies/:id` | 删除回复 | 作者/管理员 |
| PUT | `/replies/:id/review` | 审核回复 | 管理员 |

**点赞功能:**

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| POST | `/:targetType/:targetId/like` | 点赞 | 用户 |
| DELETE | `/:targetType/:targetId/like` | 取消点赞 | 用户 |

#### 🛡️ 管理员接口 `/api/v1/admin`

**统计与审核:**

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/stats` | 获取统计数据 | 管理员 |
| GET | `/pending` | 获取待审核内容 | 管理员 |
| PUT | `/comments/:id/review` | 审核评论 | 管理员 |
| PUT | `/blessings/:id/review` | 审核祝福 | 管理员 |

**用户管理:**

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/users` | 获取用户列表 | 管理员 |
| POST | `/users` | 添加用户 | 管理员 |
| PUT | `/users/:id` | 编辑用户信息 | 管理员 |
| PUT | `/users/:id/role` | 修改用户角色 | 管理员 |
| DELETE | `/users/:id` | 删除用户 | 管理员 |
| POST | `/users/batch-delete` | 批量删除用户 | 管理员 |

**批量操作:**

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| POST | `/batch-delete` | 批量删除内容 | 管理员 |

#### ⚙️ 系统配置接口 `/api/v1/admin/configs`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/` | 获取所有配置 | 管理员 |
| GET | `/:key` | 获取单个配置 | 管理员 |
| PUT | `/registration` | 设置注册开关 | 管理员 |
| PUT | `/smtp` | 设置SMTP配置 | 管理员 |
| POST | `/smtp/test` | 测试SMTP连接 | 管理员 |

#### 📊 统计接口 `/api/v1/statistics`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/overview` | 获取整体统计 | 公开 |

#### 📤 文件上传接口 `/api/v1/upload`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| POST | `/media` | 上传媒体文件 | 用户 |

---

## 数据库设计

### 数据表概览

系统共包含 **21个数据表**：

| 表名 | 说明 | 记录数（示例） |
|-----|------|-------------|
| users | 用户表 | 1000+ |
| articles | 文章表 | 50+ |
| comments | 评论表 | 500+ |
| blessings | 祝福表 | 200+ |
| visitors | 访客记录表 | 10000+ |
| future_messages | 寄语未来表 | 300+ |
| torches | 火炬表 | 1 |
| timeline_events | 时间线事件表 | 100+ |
| relay_activities | 接力活动表 | 10+ |
| relay_participations | 接力参与记录表 | 100+ |
| maxims | 格言表 | 150+ |
| maxim_likes | 格言点赞表 | 500+ |
| forums | 论坛板块表 | 5+ |
| forum_posts | 论坛帖子表 | 150+ |
| forum_replies | 论坛回复表 | 800+ |
| forum_likes | 论坛点赞表 | 1000+ |
| system_configs | 系统配置表 | 10+ |
| verification_codes | 验证码表 | 动态 |

### 核心表结构

#### users (用户表)

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(500),
  bio TEXT,
  graduation_year INT,
  department VARCHAR(100),
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role)
);
```

#### forums (论坛板块表)

```sql
CREATE TABLE forums (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(500),
  `order` INT DEFAULT 0,
  status ENUM('active', 'archived') DEFAULT 'active',
  post_count INT DEFAULT 0,
  reply_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (`status`),
  INDEX idx_order (`order`)
);
```

#### forum_posts (论坛帖子表)

```sql
CREATE TABLE forum_posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  forum_id INT NOT NULL,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  images JSON,
  is_sticky BOOLEAN DEFAULT FALSE,
  is_highlighted BOOLEAN DEFAULT FALSE,
  status ENUM('pending', 'approved', 'rejected', 'locked') DEFAULT 'approved',
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  reply_count INT DEFAULT 0,
  last_reply_at TIMESTAMP,
  last_reply_user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (forum_id) REFERENCES forums(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (last_reply_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_forum (forum_id),
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_sticky_reply (is_sticky, last_reply_at),
  INDEX idx_created (created_at)
);
```

### 数据库关系图

```
users (用户)
  ├── 1:N → articles (文章)
  ├── 1:N → comments (评论)
  ├── 1:N → blessings (祝福)
  ├── 1:N → future_messages (寄语)
  ├── 1:N → relay_participations (接力参与)
  ├── 1:N → maxims (格言)
  ├── 1:N → forum_posts (帖子)
  ├── 1:N → forum_replies (回复)
  └── M:N → maxims (通过 maxim_likes)

forums (板块)
  └── 1:N → forum_posts (帖子)

forum_posts (帖子)
  ├── 1:N → forum_replies (回复)
  └── M:N → users (通过 forum_likes)

relay_activities (接力活动)
  └── 1:N → relay_participations (参与记录)
```

---

## 实时通信

### WebSocket 端点

**连接地址:** `ws://your-domain.com/ws/relay`

### 支持的事件

#### 客户端事件

| 事件名 | 说明 | 数据格式 |
|-------|------|---------|
| `connection` | 客户端连接 | - |
| `disconnect` | 客户端断开 | - |
| `torch:send` | 发送火炬消息 | `{ message, user }` |

#### 服务器事件

| 事件名 | 说明 | 数据格式 |
|-------|------|---------|
| `presence:update` | 在线人数更新 | `{ onlineUsers }` |
| `torch:new` | 新火炬消息 | `{ message, user, timestamp }` |

### 使用示例

```javascript
import io from 'socket.io-client';

// 连接WebSocket
const socket = io('http://your-domain.com', {
  path: '/ws/relay'
});

// 监听连接成功
socket.on('connect', () => {
  console.log('已连接到服务器');
});

// 监听在线人数更新
socket.on('presence:update', (data) => {
  console.log('当前在线人数:', data.onlineUsers);
  updateOnlineCount(data.onlineUsers);
});

// 监听新火炬消息
socket.on('torch:new', (data) => {
  console.log('新火炬消息:', data);
  displayTorchMessage(data);
});

// 发送火炬消息
socket.emit('torch:send', {
  message: '传递火炬！',
  user: currentUser
});

// 断开连接
socket.on('disconnect', () => {
  console.log('已断开连接');
});
```

---

## 安全特性

### 认证与授权

- ✅ **JWT Token 认证** - 基于Token的无状态认证
- ✅ **Token 刷新机制** - Refresh Token自动续期
- ✅ **角色权限控制** - 用户/管理员分级权限
- ✅ **密码加密存储** - bcrypt加盐哈希加密

### 数据安全

- ✅ **SQL注入防护** - Sequelize ORM参数化查询
- ✅ **XSS防护** - 输入验证和输出转义
- ✅ **CSRF防护** - Token验证
- ✅ **敏感信息脱敏** - 密码、Token等信息隐藏

### 请求保护

- ✅ **速率限制** - 防止API滥用
  - 全局限制: 100请求/分钟/IP
  - 用户限制: 1000请求/小时/用户
  - 认证限制: 5次/15分钟
  - 邮件限制: 1次/分钟/邮箱
- ✅ **请求验证** - express-validator参数验证
- ✅ **CORS配置** - 跨域资源共享控制
- ✅ **文件上传限制** - 大小和类型限制

### 数据完整性

- ✅ **事务支持** - 数据库事务保证一致性
- ✅ **外键约束** - 关联数据完整性
- ✅ **唯一性约束** - 防止数据重复
- ✅ **数据验证** - 字段类型和格式验证

### 日志与监控

- ✅ **请求日志** - 记录所有API请求
- ✅ **错误日志** - 记录系统错误和异常
- ✅ **操作日志** - 记录敏感操作（创建、删除等）
- ✅ **IP记录** - 记录请求来源IP

---

## 部署

### 生产环境要求

- **服务器:** Linux (Ubuntu 20.04+ / CentOS 7+)
- **内存:** 2GB+
- **硬盘:** 20GB+
- **带宽:** 5Mbps+

### 使用PM2部署

#### 1. 安装PM2

```bash
npm install -g pm2
```

#### 2. 配置ecosystem.config.js

```javascript
module.exports = {
  apps: [{
    name: 'hohai110-api',
    script: './src/server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '500M'
  }]
};
```

#### 3. 启动应用

```bash
# 启动应用
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs hohai110-api

# 重启应用
pm2 restart hohai110-api

# 停止应用
pm2 stop hohai110-api

# 设置开机自启
pm2 startup
pm2 save
```

### 使用Nginx反向代理

#### 配置示例

```nginx
# /etc/nginx/sites-available/hohai110-api

upstream hohai110_backend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name api.yourdomain.com;

    # 重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL证书配置
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 日志配置
    access_log /var/log/nginx/hohai110-api.access.log;
    error_log /var/log/nginx/hohai110-api.error.log;

    # 上传文件大小限制
    client_max_body_size 10M;

    # 代理配置
    location / {
        proxy_pass http://hohai110_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket支持
    location /ws {
        proxy_pass http://hohai110_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 静态文件
    location /uploads {
        alias /path/to/hohai110-backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 启用配置

```bash
# 创建软链接
ln -s /etc/nginx/sites-available/hohai110-api /etc/nginx/sites-enabled/

# 测试配置
nginx -t

# 重载Nginx
systemctl reload nginx
```

### 使用Docker部署

#### Dockerfile

```dockerfile
FROM node:14-alpine

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制项目文件
COPY . .

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "src/server.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USER=root
      - DB_PASSWORD=your_password
      - DB_NAME=hohai110
      - JWT_SECRET=your-secret-key
    depends_on:
      - mysql
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=your_password
      - MYSQL_DATABASE=hohai110
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped

volumes:
  mysql_data:
```

#### 启动服务

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f api

# 停止服务
docker-compose down
```

### 部署检查清单

- [ ] 修改 `.env` 中的 `JWT_SECRET` 为强密码
- [ ] 修改数据库密码
- [ ] 配置SMTP邮件服务
- [ ] 启用HTTPS（SSL证书）
- [ ] 配置CORS允许的域名
- [ ] 设置文件上传目录权限
- [ ] 配置数据库备份策略
- [ ] 设置防火墙规则
- [ ] 配置日志轮转
- [ ] 设置监控告警

详细部署指南请参考：[DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)

---

## 文档

### 📚 完整文档列表

| 文档 | 说明 |
|-----|------|
| [README.md](./README.md) | 项目说明文档（本文档） |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | 完整API接口文档 |
| [QUICKSTART.md](./QUICKSTART.md) | 快速开始指南 |
| [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md) | 部署检查清单 |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | 故障排查指南 |
| [FORUM.md](./FORUM.md) | 论坛功能说明 |
| [NEW_FEATURES.md](./NEW_FEATURES.md) | 新功能说明 |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | 项目完成总结 |

### 📖 在线文档

- **API文档:** https://your-domain.com/api/docs
- **Postman集合:** [下载](./postman_collection.json)

---

## 开发指南

### 本地开发

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置环境变量**
   ```bash
   cp .env.example .env
   # 编辑 .env 文件
   ```

3. **启动数据库**
   ```bash
   # 确保MySQL已启动
   sudo service mysql start
   ```

4. **同步数据库**
   ```bash
   npm run sync-db
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   ```

### 代码规范

- **ESLint** - JavaScript代码检查
- **Prettier** - 代码格式化
- **命名规范:**
  - 文件名: 小驼峰 `userController.js`
  - 类名: 大驼峰 `UserController`
  - 变量/函数: 小驼峰 `getUserProfile`
  - 常量: 大写下划线 `MAX_FILE_SIZE`

### Git提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具配置
```

### 测试

```bash
# 运行测试
npm test

# 生成覆盖率报告
npm run test:coverage
```

---

## 性能优化建议

### 数据库优化

- ✅ 添加合适的索引
- ✅ 使用连接池
- ✅ 优化复杂查询
- ✅ 定期清理过期数据

### 缓存策略

- 📝 添加Redis缓存
- 📝 缓存热点数据
- 📝 实现查询结果缓存
- 📝 静态资源CDN加速

### 代码优化

- ✅ 异步处理耗时操作
- ✅ 使用分页查询
- ✅ 优化数据库查询次数
- ✅ 减少不必要的计算

---

## 常见问题

### Q1: 如何创建第一个管理员账号？

**A:** 直接在数据库中修改用户的role字段：

```sql
UPDATE users SET role = 'admin' WHERE username = 'your_username';
```

### Q2: Token过期时间是多久？

**A:**
- Access Token: 24小时
- Refresh Token: 7天

### Q3: 如何修改文件上传大小限制？

**A:** 在 `src/config/constants.js` 中修改：

```javascript
MAX_FILE_SIZE: 10 * 1024 * 1024 // 10MB
```

### Q4: 忘记数据库密码怎么办？

**A:** 参考 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) 中的数据库问题章节。

### Q5: 如何配置邮件服务？

**A:** 管理员登录后，访问系统配置页面，配置SMTP服务器信息。

更多问题请查看：[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 更新日志

### v2.0.0 (2025-10-22)

**新增功能:**
- ✨ 完整的用户管理系统（添加、编辑、删除、角色管理）
- ✨ 系统配置管理（注册开关、SMTP配置）
- ✨ 邮件服务集成（验证码、密码重置）
- ✨ 论坛完整功能（板块、帖子、回复、点赞）
- ✨ 访客统计功能
- ✨ 寄语未来功能
- ✨ 火炬传递功能

**改进:**
- 🔧 优化API响应格式
- 🔧 增强错误处理机制
- 🔧 改进速率限制策略
- 🔧 完善文档

**修复:**
- 🐛 修复评论点赞bug
- 🐛 修复Token刷新问题
- 🐛 修复文件上传路径问题

### v1.0.0 (2024-10-19)

**首次发布:**
- 🎉 基础功能实现
- 🎉 用户认证系统
- 🎉 文章、评论、祝福功能
- 🎉 时间线、接力活动、格言功能

---

## 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. **Fork 项目**
2. **创建特性分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **提交Pull Request**

### 贡献规范

- 遵循现有代码风格
- 添加必要的测试
- 更新相关文档
- 提供清晰的提交信息

---

## 开发团队

**Five Plus One Team**

- **项目经理:** [Name]
- **后端开发:** [Name]
- **数据库设计:** [Name]
- **测试工程师:** [Name]

---

## 许可证

本项目采用 **GPL-3.0** 许可证。详见 [LICENSE](./LICENSE) 文件。

这意味着：
- ✅ 可以自由使用、修改和分发本软件
- ✅ 可以用于商业目的
- ⚠️ 修改后的版本必须同样采用 GPL-3.0 协议开源
- ⚠️ 必须保留原作者的版权声明
- ⚠️ 修改后的代码必须标注修改说明

更多信息请访问：https://www.gnu.org/licenses/gpl-3.0.html

---

## 联系我们

- **前端开源地址:** https://github.com/five-plus-one/HoHai110_frontend
- **后端开源地址:** https://github.com/five-plus-one/HoHai110_backend
- **问题反馈:** https://github.com/five-plus-one/HoHai110_backend/issues
- **联系作者:** https://r-l.ink/about
- **支持我一杯咖啡:** https://r-l.ink/support

---

## 致谢

感谢所有为河海大学110周年校庆做出贡献的开发者、设计师和测试人员！

特别感谢以下开源项目：

- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Socket.IO](https://socket.io/)
- [JWT](https://jwt.io/)

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给我们一个Star！⭐**

Made with ❤️ by Five Plus One Team

© 2025 河海大学110周年校庆. All rights reserved.

</div>
