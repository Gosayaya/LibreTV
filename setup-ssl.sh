#!/bin/bash

# SSL证书设置脚本
# 用于配置LibreTV的HTTPS支持

echo "=== LibreTV SSL证书设置 ==="

# 创建SSL目录
mkdir -p ssl/lannuodo.com

# 方案1: 使用Let's Encrypt (推荐用于生产环境)
setup_letsencrypt() {
    echo "设置Let's Encrypt证书..."
    
    # 安装certbot
    if ! command -v certbot &> /dev/null; then
        echo "正在安装certbot..."
        # Ubuntu/Debian
        sudo apt-get update
        sudo apt-get install -y certbot python3-certbot-nginx
        # 或者 CentOS/RHEL
        # sudo yum install -y certbot python3-certbot-nginx
    fi
    
    # 获取证书
    sudo certbot certonly --standalone \
        -d lannuodo.com \
        -d www.lannuodo.com \
        --email your-email@example.com \
        --agree-tos \
        --no-eff-email
    
    # 复制证书到项目目录
    sudo cp /etc/letsencrypt/live/lannuodo.com/fullchain.pem ssl/lannuodo.com/lannuodo.pem
    sudo cp /etc/letsencrypt/live/lannuodo.com/privkey.pem ssl/lannuodo.com/lannuodo.key
    sudo chown $USER:$USER ssl/lannuodo.com/*
}

# 方案2: 生成自签名证书 (用于开发和测试)
setup_selfsigned() {
    echo "生成自签名证书..."
    
    # 生成私钥
    openssl genrsa -out ssl/lannuodo.com/lannuodo.key 2048
    
    # 生成证书签名请求
    openssl req -new -key ssl/lannuodo.com/lannuodo.key -out ssl/lannuodo.com/lannuodo.csr -subj "/C=CN/ST=Beijing/L=Beijing/O=LibreTV/OU=IT/CN=lannuodo.com"
    
    # 生成自签名证书
    openssl x509 -req -days 365 -in ssl/lannuodo.com/lannuodo.csr -signkey ssl/lannuodo.com/lannuodo.key -out ssl/lannuodo.com/lannuodo.pem
    
    # 清理临时文件
    rm ssl/lannuodo.com/lannuodo.csr
    
    echo "自签名证书已生成！"
    echo "注意：浏览器会显示安全警告，这在开发环境中是正常的。"
}

# 启用HTTPS配置
enable_https() {
    echo "启用HTTPS配置..."
    
    # 备份当前配置
    cp nginx.conf nginx.conf.backup
    
    # 更新nginx.conf以启用HTTPS
    sed -i 's/# server {/server {/g' nginx.conf
    sed -i 's/# }/}/g' nginx.conf
    sed -i 's/#     /    /g' nginx.conf
    
    # 更新docker-compose.yml以暴露443端口
    sed -i 's/# - "443:443"/- "443:443"/g' docker-compose.yml
    sed -i 's/# - .\/ssl:\/etc\/nginx\/ssl/- .\/ssl:\/etc\/nginx\/ssl/g' docker-compose.yml
    
    echo "HTTPS配置已启用！"
}

# 主菜单
echo "请选择SSL证书设置方案："
echo "1) Let's Encrypt证书 (生产环境推荐)"
echo "2) 自签名证书 (开发/测试环境)"
echo "3) 跳过SSL设置，仅使用HTTP"
read -p "请输入选择 (1-3): " choice

case $choice in
    1)
        setup_letsencrypt
        enable_https
        ;;
    2)
        setup_selfsigned
        enable_https
        ;;
    3)
        echo "跳过SSL设置，继续使用HTTP..."
        ;;
    *)
        echo "无效选择，退出..."
        exit 1
        ;;
esac

echo ""
echo "=== 设置完成 ==="
echo "现在可以运行以下命令启动LibreTV："
echo "docker-compose up -d"
echo ""
echo "访问地址："
if [ $choice -ne 3 ]; then
    echo "HTTPS: https://lannuodo.com"
fi
echo "HTTP: http://lannuodo.com" 