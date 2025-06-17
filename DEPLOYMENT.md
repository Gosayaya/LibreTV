# LibreTV 部署指南

## 🚨 修复 Nginx SSL 证书错误

如果你遇到以下错误：
```
nginx: [warn] the "listen ... http2" directive is deprecated
nginx: [emerg] cannot load certificate "/etc/nginx/ssl/lannuodo.com/lannuodo.pem": No such file or directory
```

## 快速解决方案

### 方案1：使用HTTP (推荐用于快速测试)

```bash
# 1. 重新构建并启动容器
docker-compose down
docker-compose up -d --build

# 2. 访问网站
# HTTP: http://localhost 或 http://lannuodo.com
```

当前配置已修复为：
- ✅ 修复了过时的 HTTP2 指令
- ✅ 暂时禁用 HTTPS，避免证书错误
- ✅ 添加了代理配置支持
- ✅ 优化了静态文件缓存

### 方案2：配置SSL证书 (用于生产环境)

```bash
# 1. 运行SSL设置脚本
./setup-ssl.sh

# 2. 选择证书类型：
#    1) Let's Encrypt (生产环境)
#    2) 自签名证书 (开发环境)
#    3) 跳过SSL设置

# 3. 重新启动服务
docker-compose down
docker-compose up -d --build
```

## 详细修复说明

### 1. Nginx配置修复

**问题：** HTTP2指令过时
```nginx
# 旧语法 (已弃用)
listen 443 ssl http2;

# 新语法 (正确)
listen 443 ssl;
http2 on;
```

**问题：** SSL证书文件不存在
```nginx
# 确保证书文件存在
ssl_certificate /etc/nginx/ssl/lannuodo.com/lannuodo.pem;
ssl_certificate_key /etc/nginx/ssl/lannuodo.com/lannuodo.key;
```

### 2. Docker配置修复

**修复前的问题：**
- 容器尝试加载不存在的SSL证书
- 使用过时的HTTP2语法
- 缺少代理配置

**修复后的改进：**
- 暂时使用HTTP，避免SSL错误
- 更新到新的HTTP2语法
- 添加完整的代理支持
- 包含健康检查

### 3. SSL证书选项

#### Let's Encrypt (免费，生产环境推荐)
```bash
# 自动获取有效的SSL证书
sudo certbot certonly --standalone \
    -d lannuodo.com \
    -d www.lannuodo.com
```

#### 自签名证书 (开发环境)
```bash
# 生成自签名证书
openssl genrsa -out ssl/lannuodo.com/lannuodo.key 2048
openssl req -new -key ssl/lannuodo.com/lannuodo.key -out ssl/lannuodo.com/lannuodo.csr
openssl x509 -req -days 365 -in ssl/lannuodo.com/lannuodo.csr -signkey ssl/lannuodo.com/lannuodo.key -out ssl/lannuodo.com/lannuodo.pem
```

## 部署步骤

### 开发环境
```bash
# 1. 克隆项目
git clone <repository-url>
cd LibreTV

# 2. 构建并启动 (仅HTTP)
docker-compose up -d --build

# 3. 访问
open http://localhost
```

### 生产环境
```bash
# 1. 设置SSL证书
./setup-ssl.sh

# 2. 配置域名解析
# 确保 lannuodo.com 和 www.lannuodo.com 指向你的服务器IP

# 3. 启动服务
docker-compose up -d --build

# 4. 访问
open https://lannuodo.com
```

## 故障排除

### 检查容器状态
```bash
docker-compose ps
docker-compose logs libretv
```

### 测试Nginx配置
```bash
docker-compose exec libretv nginx -t
```

### 重新生成证书
```bash
# 删除旧证书
rm -rf ssl/

# 重新运行SSL设置
./setup-ssl.sh
```

### 端口冲突
如果80端口被占用：
```bash
# 修改 docker-compose.yml 中的端口映射
ports:
  - "8080:80"  # 使用8080端口
```

## 安全建议

1. **生产环境必须使用HTTPS**
2. **定期更新SSL证书**
3. **配置防火墙规则**
4. **启用安全头部**
5. **定期更新Docker镜像**

## 支持

如果遇到其他问题，请：
1. 检查Docker和Docker Compose版本
2. 确认域名DNS解析正确
3. 检查防火墙和端口设置
4. 查看详细的错误日志 