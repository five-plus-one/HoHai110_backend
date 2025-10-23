# 1Panel 部署指南

本指南详细说明如何在 1Panel 面板上部署河海大学110周年校庆后端项目。

## 目录
- [环境要求](#环境要求)
- [部署步骤](#部署步骤)
- [方案一：使用 Runtime (推荐)](#方案一使用-runtime-推荐)
- [方案二：使用 Docker](#方案二使用-docker)
- [数据库配置](#数据库配置)
- [域名和反向代理配置](#域名和反向代理配置)
- [常见问题](#常见问题)

---

## 环境要求

- 1Panel 面板已安装
- Node.js 16+ (1Panel 会自动安装)
- MySQL 8.0+
- 服务器内存 ≥ 1GB
- 磁盘空间 ≥ 5GB

---

## 部署步骤

### 准备工作

#### 1. 上传项目代码

有两种方式：

**方式一：使用 Git (推荐)**
```bash
# 在 1Panel 终端中执行
cd /opt/1panel/apps
git clone <你的仓库地址> HoHai110_backend
cd HoHai110_backend
```

**方式二：上传压缩包**
1. 在本地打包项目（排除 node_modules）
2. 在 1Panel 文件管理中上传到 `/opt/1panel/apps/HoHai110_backend`
3. 解压缩

#### 2. 安装 MySQL 数据库

1. 进入 1Panel 面板
2. 点击 **应用商店** → 搜索 **MySQL**
3. 选择 **MySQL 8.0** 版本安装
4. 安装完成后，进入 **数据库** 菜单
5. 点击 **创建数据库**：
   - 数据库名：`hohai110`
   - 字符集：`utf8mb4`
   - 排序规则：`utf8mb4_unicode_ci`
   - 用户名：`hohai110_user`
   - 密码：设置强密码（记住此密码）

#### 3. 导入初始数据

在 1Panel 的 **数据库** → **phpMyAdmin** 或使用终端：

```bash
# 进入项目目录
cd /opt/1panel/apps/HoHai110_backend

# 导入初始数据
mysql -u hohai110_user -p hohai110 < init.sql
```

---

## 方案一：使用 Runtime (推荐)

这是最简单的部署方式，使用 1Panel 的运行时管理功能。

### 步骤 1：安装 Node.js 运行时

1. 进入 1Panel → **运行时**
2. 点击 **安装运行时**
3. 选择 **Node.js**，版本选择 **20.x** 或 **18.x**
4. 等待安装完成

### 步骤 2：创建网站

1. 进入 **网站** → **运行时**
2. 点击 **创建运行时网站**
3. 填写配置：

```yaml
网站名称: hohai110-backend
运行时: Node.js 20
代码目录: /opt/1panel/apps/HoHai110_backend
端口: 3001
启动命令: npm start
环境变量: (点击添加环境变量)
```

**环境变量配置：**

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NODE_ENV` | `production` | 生产环境 |
| `PORT` | `3001` | 端口号 |
| `DB_HOST` | `localhost` | 数据库主机 |
| `DB_PORT` | `3306` | 数据库端口 |
| `DB_USER` | `hohai110_user` | 数据库用户 |
| `DB_PASSWORD` | `你的数据库密码` | 数据库密码 |
| `DB_NAME` | `hohai110` | 数据库名 |
| `JWT_SECRET` | `随机生成的长字符串` | JWT密钥 |
| `UPLOAD_DIR` | `./uploads` | 上传目录 |

**生成强 JWT 密钥：**
```bash
# 在终端执行
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 步骤 3：安装依赖并启动

1. 在 1Panel 终端中执行：

```bash
cd /opt/1panel/apps/HoHai110_backend

# 安装依赖
npm install --production

# 创建必要的目录
mkdir -p logs uploads/image uploads/video

# 设置权限
chmod -R 755 uploads logs
```

2. 回到 1Panel 网站管理，点击 **启动** 按钮

### 步骤 4：使用 PM2 管理（更稳定）

如果想使用 PM2 进行进程管理：

```bash
cd /opt/1panel/apps/HoHai110_backend

# 全局安装 PM2
npm install -g pm2

# 使用 PM2 启动
pm2 start ecosystem.config.js --env production

# 保存 PM2 进程列表
pm2 save

# 设置开机自启
pm2 startup

# 查看运行状态
pm2 status

# 查看日志
pm2 logs hohai110-backend
```

**修改启动命令为：**
```
pm2 start ecosystem.config.js --env production
```

---

## 方案二：使用 Docker

使用 Docker 部署更加灵活和隔离。

### 步骤 1：创建 Dockerfile

在项目根目录创建 `Dockerfile`：

```dockerfile
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制项目文件
COPY . .

# 创建上传目录
RUN mkdir -p uploads/image uploads/video logs

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 启动应用
CMD ["npm", "start"]
```

### 步骤 2：创建 .dockerignore

```
node_modules
npm-debug.log
.env
.git
.gitignore
logs
uploads
*.md
.vscode
```

### 步骤 3：在 1Panel 中部署

1. 进入 **容器** → **编排**
2. 创建新的编排文件 `hohai110-stack.yml`：

```yaml
version: '3.8'

services:
  hohai110-backend:
    build:
      context: /opt/1panel/apps/HoHai110_backend
      dockerfile: Dockerfile
    container_name: hohai110-backend
    restart: always
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - DB_HOST=host.docker.internal
      - DB_PORT=3306
      - DB_USER=hohai110_user
      - DB_PASSWORD=你的数据库密码
      - DB_NAME=hohai110
      - JWT_SECRET=你的JWT密钥
      - UPLOAD_DIR=/app/uploads
    volumes:
      - /opt/1panel/apps/HoHai110_backend/uploads:/app/uploads
      - /opt/1panel/apps/HoHai110_backend/logs:/app/logs
    extra_hosts:
      - "host.docker.internal:host-gateway"
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s
```

3. 点击 **启动**

---

## 数据库配置

### MySQL 优化配置

在 1Panel → **数据库** → **MySQL** → **配置** 中调整：

```ini
[mysqld]
# 字符集
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci

# 连接数
max_connections=500

# 缓冲区
innodb_buffer_pool_size=256M
```

### 数据库备份

设置定时备份：

1. 进入 **数据库** → **备份**
2. 创建备份任务：
   - 数据库：`hohai110`
   - 备份周期：每天凌晨 3:00
   - 保留份数：7

---

## 域名和反向代理配置

### 步骤 1：添加域名

1. 进入 **网站** → **网站**
2. 找到刚创建的网站
3. 点击 **设置** → **域名**
4. 添加域名：`api.your-domain.com`

### 步骤 2：配置反向代理

如果使用 Nginx 反向代理：

1. 进入网站 **配置文件**
2. 添加以下配置：

```nginx
location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;

    # 超时设置
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}

# WebSocket 支持
location /ws/ {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

# 静态文件
location /uploads/ {
    alias /opt/1panel/apps/HoHai110_backend/uploads/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### 步骤 3：配置 SSL 证书

1. 在网站设置中点击 **SSL**
2. 选择 **Let's Encrypt**
3. 填写邮箱，点击申请
4. 等待证书签发完成

---

## 安全加固

### 1. 防火墙设置

在 1Panel → **主机** → **安全** → **防火墙**：

- 开放端口：80, 443
- 关闭端口：3001 (只允许内部访问)

### 2. 修改默认端口

如果需要更改端口，在环境变量中修改 `PORT` 值。

### 3. 设置访问限制

在 Nginx 配置中添加：

```nginx
# 限制上传大小
client_max_body_size 100M;

# 限制请求频率
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req zone=api_limit burst=20 nodelay;
```

---

## 监控和维护

### 1. 日志查看

**方案一：PM2 日志**
```bash
pm2 logs hohai110-backend
pm2 logs hohai110-backend --lines 100
```

**方案二：Docker 日志**
```bash
docker logs -f hohai110-backend
docker logs --tail 100 hohai110-backend
```

**方案三：直接查看日志文件**
```bash
tail -f /opt/1panel/apps/HoHai110_backend/logs/combined.log
```

### 2. 性能监控

使用 PM2 监控：
```bash
pm2 monit
```

在 1Panel 中查看：
- **主机** → **监控** 查看 CPU、内存使用情况
- **容器** → 查看容器资源占用

### 3. 自动重启

**PM2 方式：**
- PM2 已配置自动重启（`autorestart: true`）
- 内存超过 500M 自动重启

**Docker 方式：**
- 已配置 `restart: always`
- 容器异常会自动重启

---

## 更新部署

### 更新代码

```bash
cd /opt/1panel/apps/HoHai110_backend

# 拉取最新代码
git pull

# 安装新依赖
npm install --production

# 重启应用
pm2 restart hohai110-backend

# 或 Docker 方式
docker-compose -f hohai110-stack.yml up -d --build
```

### 数据库迁移

如果有数据库结构变更：

```bash
# 备份数据库
mysqldump -u hohai110_user -p hohai110 > backup_$(date +%Y%m%d).sql

# 运行迁移脚本（如果有）
npm run sync-db
```

---

## 常见问题

### 1. 端口被占用

**问题：** 启动失败，提示端口 3001 被占用

**解决：**
```bash
# 查看端口占用
lsof -i :3001
netstat -tlnp | grep 3001

# 杀掉进程或更换端口
kill -9 <PID>
```

### 2. 数据库连接失败

**问题：** `Unable to connect to the database`

**解决：**
- 检查数据库是否启动：`systemctl status mysql`
- 检查数据库用户权限
- 检查环境变量配置是否正确
- Docker 环境使用 `host.docker.internal` 而非 `localhost`

### 3. 文件上传失败

**问题：** 上传图片/视频失败

**解决：**
```bash
# 检查目录权限
ls -la /opt/1panel/apps/HoHai110_backend/uploads

# 设置正确权限
chmod -R 755 uploads
chown -R www:www uploads  # 或 chown -R 1000:1000 uploads
```

### 4. 内存不足

**问题：** 应用频繁重启

**解决：**
- 增加服务器内存
- 在 `ecosystem.config.js` 中调整 `max_memory_restart`
- 减少 PM2 的 `instances` 数量

### 5. WebSocket 连接失败

**问题：** 接力活动实时功能不工作

**解决：**
- 检查 Nginx 配置中是否正确配置了 WebSocket 代理
- 确保 `/ws/` 路径配置正确
- 检查防火墙是否阻止了连接

---

## 性能优化建议

1. **启用 Gzip 压缩**（Nginx 配置）
2. **使用 CDN** 加速静态资源
3. **配置 Redis 缓存**（如需要）
4. **数据库索引优化**
5. **定期清理日志文件**

---

## 备份策略

### 自动备份脚本

创建 `/opt/scripts/backup-hohai110.sh`：

```bash
#!/bin/bash
BACKUP_DIR="/opt/backups/hohai110"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
mysqldump -u hohai110_user -p你的密码 hohai110 > $BACKUP_DIR/db_$DATE.sql

# 备份上传文件
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /opt/1panel/apps/HoHai110_backend/uploads

# 删除7天前的备份
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

添加到 crontab：
```bash
# 每天凌晨 2:00 执行备份
0 2 * * * /opt/scripts/backup-hohai110.sh
```

---

## 支持与帮助

- 查看项目文档：`README.md`
- API 文档：`API_NEW.md`
- 快速开始：`QUICKSTART.md`

部署成功后，访问：
- API 地址：`https://api.your-domain.com/api/v1`
- 健康检查：`https://api.your-domain.com/health`
