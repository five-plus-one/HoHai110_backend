# 1Panel 部署检查清单

在部署之前，请确保完成以下步骤：

## 部署前准备

- [ ] 服务器已安装 1Panel 面板
- [ ] 服务器内存 ≥ 1GB，磁盘空间 ≥ 5GB
- [ ] 已在 1Panel 安装 MySQL 8.0
- [ ] 已创建数据库 `hohai110`（字符集：utf8mb4）
- [ ] 已创建数据库用户并授权

## 文件准备

- [ ] 项目代码已上传至服务器
- [ ] 已复制 `.env.example` 为 `.env`
- [ ] 已配置 `.env` 文件中的数据库信息
- [ ] 已生成强 JWT 密钥（使用：`node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`）

## 部署步骤

### 方案一：使用 PM2（推荐）

```bash
# 1. 进入项目目录
cd /opt/1panel/apps/HoHai110_backend

# 2. 安装依赖
npm install --production

# 3. 创建目录
mkdir -p logs uploads/image uploads/video
chmod -R 755 logs uploads

# 4. 安装 PM2
npm install -g pm2

# 5. 启动应用
pm2 start ecosystem.config.js --env production

# 6. 保存进程列表
pm2 save

# 7. 设置开机自启
pm2 startup

# 8. 查看状态
pm2 status
```

### 方案二：使用快速部署脚本

```bash
# 1. 赋予执行权限
chmod +x deploy.sh

# 2. 运行部署脚本
./deploy.sh
```

### 方案三：使用 Docker

```bash
# 1. 修改 docker-compose.prod.yml 中的环境变量

# 2. 构建并启动容器
docker-compose -f docker-compose.prod.yml up -d --build

# 3. 查看日志
docker-compose -f docker-compose.prod.yml logs -f
```

## 部署后配置

- [ ] 已导入初始数据（`init.sql`）
- [ ] 应用成功启动，访问 `/health` 返回 200
- [ ] 在 1Panel 配置域名
- [ ] 配置 Nginx 反向代理
- [ ] 申请并配置 SSL 证书
- [ ] 配置防火墙规则
- [ ] 设置数据库自动备份
- [ ] 配置文件上传目录备份

## 测试验证

- [ ] 访问健康检查接口：`http://your-ip:3001/health`
- [ ] 测试用户注册接口
- [ ] 测试用户登录接口
- [ ] 测试文件上传功能
- [ ] 测试 WebSocket 连接（接力活动）

## 监控维护

- [ ] PM2 监控：`pm2 monit`
- [ ] 日志查看：`pm2 logs hohai110-backend`
- [ ] 在 1Panel 监控面板查看资源使用

## 常用命令

### PM2 管理

```bash
pm2 status                     # 查看状态
pm2 logs hohai110-backend     # 查看日志
pm2 restart hohai110-backend  # 重启
pm2 stop hohai110-backend     # 停止
pm2 delete hohai110-backend   # 删除
```

### Docker 管理

```bash
docker-compose -f docker-compose.prod.yml ps       # 查看状态
docker-compose -f docker-compose.prod.yml logs -f  # 查看日志
docker-compose -f docker-compose.prod.yml restart  # 重启
docker-compose -f docker-compose.prod.yml down     # 停止并删除
```

### 数据库管理

```bash
# 备份数据库
mysqldump -u hohai110_user -p hohai110 > backup.sql

# 恢复数据库
mysql -u hohai110_user -p hohai110 < backup.sql
```

## 故障排查

### 应用无法启动

1. 检查端口是否被占用：`lsof -i :3001`
2. 检查日志：`pm2 logs` 或 `docker logs hohai110-backend`
3. 检查环境变量配置是否正确
4. 检查数据库是否可连接

### 数据库连接失败

1. 检查 MySQL 是否启动：`systemctl status mysql`
2. 测试数据库连接：`mysql -u hohai110_user -p`
3. 检查数据库用户权限
4. Docker 环境确保使用 `host.docker.internal`

### 文件上传失败

1. 检查 `uploads` 目录权限
2. 检查磁盘空间：`df -h`
3. 检查 Nginx 配置的 `client_max_body_size`

## 性能优化

- [ ] 启用 Nginx Gzip 压缩
- [ ] 配置静态资源缓存
- [ ] 优化数据库索引
- [ ] 考虑使用 CDN 加速静态资源
- [ ] 定期清理日志文件

## 安全加固

- [ ] 修改默认端口（如需要）
- [ ] 配置防火墙，关闭不必要的端口
- [ ] 使用强密码
- [ ] 定期更新依赖包：`npm audit`
- [ ] 配置请求频率限制
- [ ] 启用 HTTPS

## 备份策略

- [ ] 数据库每日自动备份
- [ ] 上传文件定期备份
- [ ] 保留最近 7 天备份
- [ ] 测试恢复流程

---

完成以上检查后，你的项目就可以稳定运行了！

详细文档：[DEPLOY_1PANEL.md](DEPLOY_1PANEL.md)
