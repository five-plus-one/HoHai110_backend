# 河海大学110周年校庆后端 - 快速开始指南

## 前置要求

- Node.js 14+
- MySQL 8.0+
- npm 或 yarn

## 快速开始

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

复制 `.env` 文件并根据实际情况修改：

```env
PORT=3000
NODE_ENV=development

# 数据库配置（重要！）
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的数据库密码
DB_NAME=hohai110

# JWT密钥（生产环境必须修改！）
JWT_SECRET=你的安全密钥

# 上传目录
UPLOAD_DIR=./uploads
```

### 4. 创建数据库

```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE hohai110 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. 同步数据库表结构

```bash
npm run sync-db
```

### 6. （可选）导入示例数据

```bash
mysql -u root -p hohai110 < init.sql
```

### 7. 启动服务

开发模式（支持热重载）：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

### 8. 测试接口

服务启动后，访问：
- API地址：http://localhost:3000/api/v1
- 健康检查：http://localhost:3000/health
- WebSocket：ws://localhost:3000/ws/relay

使用 `api-test.http` 文件测试各个接口（需要 REST Client 插件）

## 目录结构说明

```
src/
├── config/           # 配置文件
├── models/           # 数据模型（数据库表）
├── controllers/      # 控制器（业务逻辑）
├── routes/           # 路由定义
├── middleware/       # 中间件（认证、错误处理等）
├── utils/            # 工具函数
└── server.js         # 入口文件
```

## 主要功能模块

1. **用户认证** - 注册、登录、Token刷新
2. **时间线** - 展示学校历史事件
3. **接力活动** - 用户参与校庆活动
4. **格言征集** - 提交和点赞格言
5. **地图** - 校友分布展示
6. **海报** - 海报浏览和下载
7. **拼图** - 互动拼图游戏
8. **用户信息** - 个人资料管理
9. **统计** - 校庆数据统计
10. **文件上传** - 图片和视频上传

## 常见问题

### 数据库连接失败

检查 `.env` 文件中的数据库配置是否正确：
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=你的密码
DB_NAME=hohai110
```

### 端口被占用

修改 `.env` 中的 PORT 值：
```env
PORT=3001
```

### 文件上传失败

确保 `uploads` 目录存在且有写入权限：
```bash
mkdir -p uploads/image uploads/video
chmod -R 755 uploads
```

## API文档

完整的API文档请参考 `README.md` 或接口设计文档。

快速测试示例：

```bash
# 注册用户
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@hohai.edu.cn",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# 登录
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

## 生产部署

1. 使用 PM2 进程管理：
```bash
npm install -g pm2
pm2 start ecosystem.config.js
```

2. 配置 Nginx 反向代理（参考 `nginx.conf.example`）

3. 配置 SSL 证书（推荐使用 Let's Encrypt）

4. 设置自动备份数据库

## 获取帮助

如有问题，请查看：
- [README.md](./README.md) - 完整文档
- [api-test.http](./api-test.http) - API测试示例
- [init.sql](./init.sql) - 数据库结构和示例数据

## 项目链接

- **前端开源地址:** https://github.com/five-plus-one/HoHai110_frontend
- **后端开源地址:** https://github.com/five-plus-one/HoHai110_backend
- **问题反馈:** https://github.com/five-plus-one/HoHai110_backend/issues
- **联系作者:** https://r-l.ink/about
- **支持我一杯咖啡:** https://r-l.ink/support

## License

本项目采用 **GPL-3.0** 许可证。

这意味着您可以自由使用、修改和分发本软件，但修改后的版本必须同样采用 GPL-3.0 协议开源。

详见 [LICENSE](./LICENSE) 文件或访问：https://www.gnu.org/licenses/gpl-3.0.html
