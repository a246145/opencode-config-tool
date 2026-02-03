"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path = __importStar(require("path"));
const config_1 = __importDefault(require("./routes/config"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// ============================================================================
// Middleware
// ============================================================================
// CORS 配置
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
// Body 解析
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// 请求日志
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});
// ============================================================================
// API Routes
// ============================================================================
// 健康检查
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
// 配置相关路由
app.use('/api/config', config_1.default);
// 模板路由（直接挂载到 /api/templates）
app.get('/api/templates', config_1.default);
// ============================================================================
// Static Files (生产环境)
// ============================================================================
// 静态文件服务 - 提供 Vite 构建产物
const distPath = path.join(__dirname, '../dist');
app.use(express_1.default.static(distPath));
// SPA fallback - 所有未匹配的路由返回 index.html
app.get('*', (req, res) => {
    // 排除 API 路由
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({
            error: 'API endpoint not found',
            path: req.path
        });
    }
    res.sendFile(path.join(distPath, 'index.html'));
});
// ============================================================================
// Error Handling
// ============================================================================
// 404 处理（API 路由）
app.use('/api/*', (req, res) => {
    res.status(404).json({
        error: 'API endpoint not found',
        path: req.path,
        method: req.method
    });
});
app.use((err, req, res, next) => {
    // 记录错误
    console.error('Error occurred:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });
    // 确定状态码
    const statusCode = err.status || err.statusCode || 500;
    // 返回错误响应
    res.status(statusCode).json({
        error: err.message || 'Internal server error',
        path: req.path,
        timestamp: new Date().toISOString(),
        // 仅在开发环境返回堆栈信息
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});
// ============================================================================
// Server Startup
// ============================================================================
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 OpenCode Config Tool WebUI Server');
    console.log('='.repeat(60));
    console.log(`📡 Server running at: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📁 Static files: ${distPath}`);
    console.log(`🔧 API endpoints:`);
    console.log(`   - GET  /api/health`);
    console.log(`   - GET  /api/config/path`);
    console.log(`   - GET  /api/config?path=xxx`);
    console.log(`   - POST /api/config`);
    console.log(`   - GET  /api/templates`);
    console.log('='.repeat(60));
});
// 优雅关闭
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    process.exit(0);
});
//# sourceMappingURL=index.js.map