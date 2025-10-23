#!/bin/bash

# 河海大学110周年校庆后端 - 1Panel 快速部署脚本
# 使用方法: chmod +x deploy.sh && ./deploy.sh

set -e

echo "=========================================="
echo "河海大学110周年校庆后端 - 1Panel 部署脚本"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
   echo -e "${RED}请使用 root 用户运行此脚本${NC}"
   exit 1
fi

# 1. 检查环境
echo -e "${GREEN}[1/8] 检查环境...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js 未安装，正在安装...${NC}"
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
    yum install -y nodejs || apt-get install -y nodejs
fi

NODE_VERSION=$(node -v)
echo "Node.js 版本: $NODE_VERSION"

if ! command -v mysql &> /dev/null; then
    echo -e "${RED}MySQL 未安装，请先在 1Panel 中安装 MySQL 8.0${NC}"
    exit 1
fi

# 2. 安装依赖
echo ""
echo -e "${GREEN}[2/8] 安装项目依赖...${NC}"
npm install --production

# 3. 创建必要的目录
echo ""
echo -e "${GREEN}[3/8] 创建必要的目录...${NC}"
mkdir -p logs uploads/image uploads/video
chmod -R 755 logs uploads

# 4. 配置环境变量
echo ""
echo -e "${GREEN}[4/8] 配置环境变量...${NC}"
if [ ! -f .env ]; then
    echo -e "${YELLOW}未找到 .env 文件，从模板创建...${NC}"
    cp .env.example .env

    # 生成随机 JWT 密钥
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

    # 交互式配置
    echo ""
    read -p "请输入数据库主机 [localhost]: " DB_HOST
    DB_HOST=${DB_HOST:-localhost}

    read -p "请输入数据库端口 [3306]: " DB_PORT
    DB_PORT=${DB_PORT:-3306}

    read -p "请输入数据库名称 [hohai110]: " DB_NAME
    DB_NAME=${DB_NAME:-hohai110}

    read -p "请输入数据库用户名 [hohai110_user]: " DB_USER
    DB_USER=${DB_USER:-hohai110_user}

    read -sp "请输入数据库密码: " DB_PASSWORD
    echo ""

    read -p "请输入应用端口 [3001]: " PORT
    PORT=${PORT:-3001}

    # 更新 .env 文件
    sed -i "s/DB_HOST=.*/DB_HOST=$DB_HOST/" .env
    sed -i "s/DB_PORT=.*/DB_PORT=$DB_PORT/" .env
    sed -i "s/DB_NAME=.*/DB_NAME=$DB_NAME/" .env
    sed -i "s/DB_USER=.*/DB_USER=$DB_USER/" .env
    sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" .env
    sed -i "s/PORT=.*/PORT=$PORT/" .env
    sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env

    echo -e "${GREEN}环境变量配置完成！${NC}"
else
    echo -e "${YELLOW}.env 文件已存在，跳过配置${NC}"
fi

# 5. 测试数据库连接
echo ""
echo -e "${GREEN}[5/8] 测试数据库连接...${NC}"
source .env
if mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_NAME;" 2>/dev/null; then
    echo -e "${GREEN}数据库连接成功！${NC}"
else
    echo -e "${RED}数据库连接失败！请检查配置${NC}"
    exit 1
fi

# 6. 导入初始数据
echo ""
echo -e "${GREEN}[6/8] 导入初始数据...${NC}"
read -p "是否导入初始数据？这将清空现有数据！(y/N): " IMPORT_DATA
if [[ $IMPORT_DATA =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}正在导入数据...${NC}"
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < init.sql
    echo -e "${GREEN}初始数据导入完成！${NC}"
else
    echo -e "${YELLOW}跳过数据导入${NC}"
fi

# 7. 安装 PM2
echo ""
echo -e "${GREEN}[7/8] 安装 PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    echo -e "${GREEN}PM2 安装完成！${NC}"
else
    echo -e "${YELLOW}PM2 已安装，跳过${NC}"
fi

# 8. 启动应用
echo ""
echo -e "${GREEN}[8/8] 启动应用...${NC}"
read -p "选择启动方式 (1: PM2, 2: 直接启动, 3: Docker): " START_MODE

case $START_MODE in
    1)
        echo -e "${YELLOW}使用 PM2 启动...${NC}"
        pm2 start ecosystem.config.js --env production
        pm2 save
        pm2 startup
        echo ""
        echo -e "${GREEN}应用已启动！${NC}"
        echo ""
        echo "常用命令："
        echo "  查看状态: pm2 status"
        echo "  查看日志: pm2 logs hohai110-backend"
        echo "  重启应用: pm2 restart hohai110-backend"
        echo "  停止应用: pm2 stop hohai110-backend"
        ;;
    2)
        echo -e "${YELLOW}直接启动应用...${NC}"
        npm start
        ;;
    3)
        echo -e "${YELLOW}使用 Docker 启动...${NC}"
        if ! command -v docker &> /dev/null; then
            echo -e "${RED}Docker 未安装！${NC}"
            exit 1
        fi
        docker-compose -f docker-compose.prod.yml up -d --build
        echo -e "${GREEN}Docker 容器已启动！${NC}"
        echo ""
        echo "常用命令："
        echo "  查看日志: docker-compose -f docker-compose.prod.yml logs -f"
        echo "  重启容器: docker-compose -f docker-compose.prod.yml restart"
        echo "  停止容器: docker-compose -f docker-compose.prod.yml down"
        ;;
    *)
        echo -e "${RED}无效的选择${NC}"
        exit 1
        ;;
esac

echo ""
echo "=========================================="
echo -e "${GREEN}部署完成！${NC}"
echo "=========================================="
echo ""
echo "访问地址："
echo "  API: http://localhost:$PORT/api/v1"
echo "  健康检查: http://localhost:$PORT/health"
echo ""
echo "后续步骤："
echo "  1. 配置 Nginx 反向代理"
echo "  2. 申请 SSL 证书"
echo "  3. 配置防火墙"
echo "  4. 设置定时备份"
echo ""
echo "详细文档请参考: DEPLOY_1PANEL.md"
echo ""
