# 故障排查指南

## 问题：数据库连接失败

### 错误信息
```
Unable to start server: ConnectionRefusedError [SequelizeConnectionRefusedError]:
connect ECONNREFUSED 172.18.0.15:3307
```

### 原因分析

这个错误表示应用无法连接到数据库，可能的原因：

1. **端口配置错误** - MySQL 默认端口是 `3306`，不是 `3307`
2. **主机地址错误** - Docker 容器内无法使用 `localhost` 访问宿主机
3. **MySQL 服务未启动**
4. **数据库用户权限问题**
5. **防火墙阻止连接**

---

## 解决方案

### 1. 检查并修正 .env 配置

根据你的部署方式选择正确的配置：

#### Docker 部署（当前情况）

```env
# 使用 host.docker.internal 访问宿主机的 MySQL
DB_HOST=host.docker.internal
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的密码
DB_NAME=hohai110
```

#### 直接部署（PM2 或 Node.js）

```env
# 直接使用 localhost
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的密码
DB_NAME=hohai110
```

#### 1Panel 中的 MySQL 容器

如果 MySQL 也是 Docker 容器，需要查看容器名称：

```bash
# 查看 MySQL 容器名称
docker ps | grep mysql

# 假设容器名为 1panel-mysql-abcd
DB_HOST=1panel-mysql-abcd
DB_PORT=3306
```

或者在 `docker-compose.prod.yml` 中添加 MySQL 服务：

```yaml
services:
  mysql:
    image: mysql:8.0
    container_name: hohai110-mysql
    environment:
      MYSQL_ROOT_PASSWORD: 你的密码
      MYSQL_DATABASE: hohai110
    ports:
      - "3306:3306"
    networks:
      - hohai110-network

  hohai110-backend:
    # ... 其他配置
    depends_on:
      - mysql
    environment:
      - DB_HOST=mysql  # 使用服务名
      - DB_PORT=3306
```

### 2. 验证 MySQL 端口

在 1Panel 中检查 MySQL 端口：

1. 进入 **数据库** → **MySQL**
2. 查看端口号（通常是 `3306`）
3. 如果是自定义端口，相应修改 `.env` 中的 `DB_PORT`

或使用命令检查：

```bash
# 检查 MySQL 监听端口
netstat -tlnp | grep mysql

# 或
ss -tlnp | grep mysql
```

### 3. 检查 MySQL 是否启动

```bash
# 1Panel 中的 MySQL 容器
docker ps | grep mysql

# 如果未启动，在 1Panel 中启动 MySQL
# 或使用命令
docker start <mysql-container-name>

# 系统服务方式
systemctl status mysql
systemctl start mysql
```

### 4. 测试数据库连接

#### 从宿主机测试

```bash
mysql -h localhost -P 3306 -u root -p
# 输入密码后执行
USE hohai110;
SHOW TABLES;
```

#### 从 Docker 容器内测试

```bash
# 进入容器
docker exec -it hohai110-backend sh

# 测试连接（需要先安装 mysql-client）
apk add mysql-client
mysql -h host.docker.internal -P 3306 -u root -p

# 或使用 Node.js 测试
node -e "
const mysql = require('mysql2');
const conn = mysql.createConnection({
  host: 'host.docker.internal',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'hohai110'
});
conn.connect(err => {
  if (err) console.error('连接失败:', err);
  else console.log('连接成功!');
  process.exit();
});
"
```

### 5. 检查数据库用户权限

```bash
# 登录 MySQL
mysql -u root -p

# 检查用户权限
SELECT user, host FROM mysql.user WHERE user='root';

# 如果需要，授予远程访问权限
GRANT ALL PRIVILEGES ON hohai110.* TO 'root'@'%' IDENTIFIED BY '你的密码';
FLUSH PRIVILEGES;

# 或创建专用用户
CREATE USER 'hohai110_user'@'%' IDENTIFIED BY '密码';
GRANT ALL PRIVILEGES ON hohai110.* TO 'hohai110_user'@'%';
FLUSH PRIVILEGES;
```

### 6. 检查防火墙

```bash
# 查看防火墙状态
firewall-cmd --state

# 如果需要，开放 MySQL 端口（仅本地访问不需要）
firewall-cmd --permanent --add-port=3306/tcp
firewall-cmd --reload

# 或暂时关闭防火墙测试
systemctl stop firewalld
```

### 7. 修改 docker-compose.prod.yml

如果使用 Docker Compose，确保配置正确：

```yaml
version: '3.8'

services:
  hohai110-backend:
    # ... 其他配置
    environment:
      - DB_HOST=host.docker.internal  # 关键配置
      - DB_PORT=3306
      - DB_USER=root
      - DB_PASSWORD=123456
      - DB_NAME=hohai110
    extra_hosts:
      - "host.docker.internal:host-gateway"  # 重要！
```

---

## 完整排查步骤

### 第一步：确认 MySQL 运行状态

```bash
# 在 1Panel 中查看或执行
docker ps | grep mysql
# 应该看到 MySQL 容器在运行
```

### 第二步：确认 MySQL 端口

```bash
# 检查 MySQL 监听端口
docker port <mysql-container-name>
# 应该看到：3306/tcp -> 0.0.0.0:3306
```

### 第三步：修改 .env 文件

根据你的部署方式：

**Docker 部署（推荐）：**
```env
DB_HOST=host.docker.internal
DB_PORT=3306
```

**直接部署：**
```env
DB_HOST=localhost
DB_PORT=3306
```

**MySQL 也在 Docker 中：**
```env
DB_HOST=<mysql-container-name>
DB_PORT=3306
```

### 第四步：重启应用

```bash
# Docker 方式
docker-compose -f docker-compose.prod.yml restart

# 或重新构建
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# PM2 方式
pm2 restart hohai110-backend
```

### 第五步：查看日志

```bash
# Docker 日志
docker-compose -f docker-compose.prod.yml logs -f hohai110-backend

# 应该看到：
# Database connection established successfully.
# Server running on http://localhost:3001
```

---

## 快速修复命令

如果你正在使用 Docker 部署，执行以下命令：

```bash
# 1. 停止容器
docker-compose -f docker-compose.prod.yml down

# 2. 修改 .env 文件
cat > .env << 'EOF'
PORT=3001
NODE_ENV=production

# Database Configuration
DB_HOST=host.docker.internal
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123456
DB_NAME=hohai110

# JWT Configuration
JWT_SECRET=hohai110-secret-key-change-in-production-please

# Upload Configuration
UPLOAD_DIR=./uploads
EOF

# 3. 重新启动
docker-compose -f docker-compose.prod.yml up -d --build

# 4. 查看日志
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 常见错误及解决方案

### 错误 1: ECONNREFUSED (连接被拒绝)

**原因：** 数据库服务未启动或端口/主机配置错误

**解决：**
- 检查 MySQL 是否运行
- 确认端口是 3306
- Docker 环境使用 `host.docker.internal`

### 错误 2: Access denied for user

**原因：** 用户名或密码错误

**解决：**
```bash
# 重置 MySQL root 密码
docker exec -it <mysql-container> mysql -u root -p
ALTER USER 'root'@'%' IDENTIFIED BY '新密码';
FLUSH PRIVILEGES;
```

### 错误 3: Unknown database 'hohai110'

**原因：** 数据库不存在

**解决：**
```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS hohai110 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 或在 1Panel 中手动创建
```

### 错误 4: ER_NOT_SUPPORTED_AUTH_MODE

**原因：** MySQL 8.0 认证插件不兼容

**解决：**
```sql
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '密码';
FLUSH PRIVILEGES;
```

---

## 验证成功

当配置正确后，你应该看到以下日志：

```
Database connection established successfully.
Database synchronized.
Server running on http://localhost:3001
API available at http://localhost:3001/api/v1
WebSocket available at http://localhost:3001/ws/relay
```

然后访问：
```bash
curl http://localhost:3001/health
# 返回：{"status":"ok","timestamp":"..."}
```

---

## 获取帮助

如果以上方法都无效，请提供以下信息：

1. 部署方式（Docker / PM2 / 直接运行）
2. MySQL 安装方式（1Panel 容器 / 系统服务）
3. `.env` 文件内容（隐藏密码）
4. 完整错误日志
5. 运行以下命令的输出：

```bash
docker ps
netstat -tlnp | grep 3306
cat .env | grep DB_
```
