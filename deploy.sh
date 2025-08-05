#!/bin/bash

set -e

echo "🚀 开始部署 Vue 项目到服务器..."

# 配置变量
PROJECT_NAME="vue-project-template7"
DEPLOY_DIR="/opt/${PROJECT_NAME}"
BACKUP_DIR="/opt/backups/${PROJECT_NAME}"

# 创建部署目录
echo "📁 创建部署目录..."
sudo mkdir -p ${DEPLOY_DIR}
sudo mkdir -p ${BACKUP_DIR}

# 备份旧版本（如果存在）
if [ -d "${DEPLOY_DIR}/dist" ]; then
    echo "💾 备份旧版本..."
    sudo cp -r ${DEPLOY_DIR} ${BACKUP_DIR}/backup-$(date +%Y%m%d-%H%M%S)
fi

# 停止旧容器
echo "🛑 停止旧容器..."
cd ${DEPLOY_DIR}
sudo docker-compose down || true

# 复制新文件
echo "📋 复制项目文件..."
sudo cp -r $(pwd)/* ${DEPLOY_DIR}/
cd ${DEPLOY_DIR}

# 设置权限
sudo chown -R $(whoami):$(whoami) ${DEPLOY_DIR}

# 检查必要文件
echo "🔍 检查部署文件..."
required_files=("docker-compose.yml" "Dockerfile" "nginx.conf" "dist" "docs")
for file in "${required_files[@]}"; do
    if [ ! -e "$file" ]; then
        echo "❌ 错误: 缺少必要文件 $file"
        exit 1
    fi
done

# 配置防火墙（如果需要）
echo "🔥 配置防火墙..."
sudo firewall-cmd --permanent --add-port=8089/tcp || true
sudo firewall-cmd --reload || true

# 启动服务
echo "🚀 启动服务..."
sudo docker-compose up -d --build

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."
sudo docker-compose ps

# 健康检查
echo "🏥 进行健康检查..."
if curl -f http://localhost:8089/ >/dev/null 2>&1; then
    echo "✅ 主应用部署成功! 访问地址: http://$(hostname -I | awk '{print $1}'):8089"
else
    echo "❌ 主应用访问失败，请检查日志"
    sudo docker-compose logs
    exit 1
fi

# 显示访问地址
SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')
echo ""
echo "🎉 部署完成!"
echo "📱 访问地址:"
echo "   主应用: http://${SERVER_IP}:8089/"
echo "   Vue2 子应用: http://${SERVER_IP}:8089/subapp/vue2/"
echo "   Vue3 子应用: http://${SERVER_IP}:8089/subapp/vue3/"
echo "   React 子应用: http://${SERVER_IP}:8089/subapp/react/"
echo "   Angular 子应用: http://${SERVER_IP}:8089/subapp/angular/"
echo "   📚 帮助文档: http://${SERVER_IP}:8089/docs/"
echo ""
echo "📋 常用命令:"
echo "   查看日志: cd ${DEPLOY_DIR} && sudo docker-compose logs -f"
echo "   重启服务: cd ${DEPLOY_DIR} && sudo docker-compose restart"
echo "   停止服务: cd ${DEPLOY_DIR} && sudo docker-compose down" 