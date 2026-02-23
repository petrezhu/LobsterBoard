# LobsterBoard 图片加载问题 - 调试报告

## 问题诊断

### 症状
- 浏览器访问 http://113.45.170.85/pages/agents-pixel/ 时，图片无法显示
- curl 测试返回 502 Bad Gateway
- 浏览器控制台无明显错误

### 根本原因
Nginx 配置中 `/pages/` 路径代理到 `http://127.0.0.1:8080`，但该端口没有运行任何服务。

```nginx
location ^~ /pages/ {
    proxy_pass http://127.0.0.1:8080/pages/;
    # ...
}
```

## 解决方案

### 1. 创建 Pages 静态文件服务器

创建 `/root/git/LobsterBoard/pages-server.cjs`：
- 监听 127.0.0.1:8080
- 提供 `/root/git/LobsterBoard/pages/` 目录下的静态文件
- 支持所有常见 MIME 类型（PNG、JS、HTML、CSS 等）
- 自动处理目录索引（index.html）

### 2. 配置 systemd 服务

创建 `/etc/systemd/system/lobsterboard-pages.service`：
```ini
[Unit]
Description=LobsterBoard Pages Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/git/LobsterBoard
ExecStart=/usr/bin/node /root/git/LobsterBoard/pages-server.cjs
Restart=always
RestartSec=10
StandardOutput=append:/root/.openclaw/logs/pages-server.log
StandardError=append:/root/.openclaw/logs/pages-server.log

[Install]
WantedBy=multi-user.target
```

启动服务：
```bash
systemctl daemon-reload
systemctl enable lobsterboard-pages
systemctl start lobsterboard-pages
```

### 3. 改进 Phaser 游戏代码

更新 `/root/git/LobsterBoard/pages/agents-pixel/index.html`：
- 修复图片加载路径（使用绝对路径 `/pages/agents-pixel/assets/...`）
- 添加加载进度调试信息
- 改进精灵创建和动画逻辑
- 添加边界检查

## 验证结果

### 图片加载测试
```
✅ 56/56 图片加载成功
```

所有 7 个 Agent × 2 个动作 × 4 个方向 = 56 张图片都能正常加载。

### HTTP 状态
```
curl -I http://113.45.170.85/pages/agents-pixel/assets/ancient-style-64/bibi-idle-down.png
HTTP/1.1 200 OK
Content-Type: image/png
Content-Length: 11655
```

## 访问地址

- **游戏页面**: http://113.45.170.85/pages/agents-pixel/
- **调试页面**: http://113.45.170.85/pages/agents-pixel/debug.html
- **图片测试**: http://113.45.170.85/pages/agents-pixel/test-images.html

## 服务监控

查看服务状态：
```bash
systemctl status lobsterboard-pages
```

查看日志：
```bash
tail -f /root/.openclaw/logs/pages-server.log
```

## 下一步

1. ✅ 图片加载问题已解决
2. 可选：优化 Phaser 游戏逻辑（动画、交互等）
3. 可选：集成 OpenClaw Agent 状态实时更新
4. 可选：添加更多游戏功能（点击交互、对话等）

---

**调试完成时间**: 2026-02-23 20:25 CST
**调试人员**: 验安 🧪
