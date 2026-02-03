# OpenCode Config Tool - WebUI Server

Express 服务器用于 WebUI 模式，提供配置文件管理和模板服务。

## 功能特性

### API 端点

#### 健康检查
- `GET /api/health` - 服务器健康状态

#### 配置管理
- `GET /api/config/path` - 获取默认配置文件路径
- `GET /api/config?path=xxx` - 读取配置文件
- `POST /api/config` - 保存配置文件

#### 模板管理
- `GET /api/templates` - 获取所有可用模板列表

### 特性

✅ **CORS 支持** - 跨域资源共享配置
✅ **错误处理** - 统一的错误处理中间件
✅ **请求日志** - 自动记录所有 API 请求
✅ **静态文件服务** - 提供 Vite 构建产物
✅ **SPA 路由** - 支持前端路由回退
✅ **路径扩展** - 自动处理 `~` 符号
✅ **目录创建** - 自动创建不存在的配置目录
✅ **JSON 验证** - 保存前验证 JSON 格式

## 开发

### 启动开发服务器

```bash
npm run server:dev
```

使用 `tsx watch` 实现热重载，修改代码后自动重启。

### 构建生产版本

```bash
npm run server:build
```

编译 TypeScript 到 `dist-server/` 目录。

### 启动生产服务器

```bash
npm run server:start
```

运行编译后的 JavaScript 代码。

## 配置

### 环境变量

- `PORT` - 服务器端口（默认: 3001）
- `CORS_ORIGIN` - CORS 允许的源（默认: *）
- `NODE_ENV` - 运行环境（development/production）

### 默认配置路径

- **Windows**: `C:\Users\<username>\.config\opencode\opencode.json`
- **macOS/Linux**: `~/.config/opencode/opencode.json`

## 项目结构

```
server/
├── index.ts              # 主服务器入口
├── routes/
│   └── config.ts         # 配置相关路由
├── tsconfig.json         # TypeScript 配置
└── README.md            # 本文档
```

## API 使用示例

### 读取配置

```bash
curl http://localhost:3001/api/config
```

### 保存配置

```bash
curl -X POST http://localhost:3001/api/config \
  -H "Content-Type: application/json" \
  -d '{
    "path": "~/.config/opencode/opencode.json",
    "content": "{\"$schema\":\"https://opencode.ai/config.json\"}"
  }'
```

### 获取模板列表

```bash
curl http://localhost:3001/api/templates
```

## 错误处理

所有错误响应遵循统一格式：

```json
{
  "error": "错误描述",
  "message": "详细错误信息",
  "path": "/api/config",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

开发环境下会额外返回 `stack` 字段。

## 依赖

- `express` - Web 框架
- `cors` - CORS 中间件
- `fs-extra` - 增强的文件系统操作
- `typescript` - TypeScript 支持
- `tsx` - TypeScript 执行器（开发）

## 许可证

MIT
