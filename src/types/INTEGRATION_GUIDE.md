# Electron API 类型定义集成指南

## 概述

本项目已完成 Electron API 的 TypeScript 类型定义。这提供了完整的类型安全性和智能代码补全。

## 文件结构

```
src/types/
├── electron.d.ts          # 完整的 Electron API 类型定义 (新)
├── electron.ts            # 向后兼容性包装 (旧)
├── config.ts              # OpenCode 配置类型
└── ELECTRON_API.md        # 详细使用文档
```

## 快速开始

### 1. 基本使用

```typescript
import type { ElectronAPI } from '@/types/electron';

// 类型安全的 API 访问
const api: ElectronAPI = window.electronAPI!;

// 或使用辅助函数
import { getElectronAPI } from '@/types/electron';
const api = getElectronAPI(); // 如果不可用会抛出错误
```

### 2. 在 React 中使用

```typescript
import { useElectronAPI } from '@/types/electron';

function MyComponent() {
  const api = useElectronAPI(); // 返回 null 如果不可用

  if (!api) {
    return <div>Not in Electron</div>;
  }

  return <div>Electron available</div>;
}
```

### 3. 检查可用性

```typescript
import { isElectronAvailable } from '@/types/electron';

if (isElectronAvailable()) {
  // 安全地使用 Electron API
  const api = window.electronAPI!;
}
```

## API 分类

### 文件操作 (FileOperations)

```typescript
// 读取文件
const content = await api.readFile('/path/to/file.txt');

// 写入文件
await api.writeFile('/path/to/file.txt', 'content');

// JSON 操作
const data = await api.readJSON<MyType>('/path/to/file.json');
await api.writeJSON('/path/to/file.json', data);

// 文件检查
const exists = await api.fileExists('/path/to/file.txt');
await api.deleteFile('/path/to/file.txt');
```

### 目录操作 (DirectoryOperations)

```typescript
// 获取路径
const configPath = await api.getConfigPath();
const homePath = await api.getHomePath();
const appDataPath = await api.getAppDataPath();

// 目录管理
const files = await api.listDirectory('/path');
await api.createDirectory('/path/to/new/dir');
const exists = await api.directoryExists('/path');
```

### 对话框 (DialogOperations)

```typescript
// 打开文件对话框
const filePath = await api.showOpenDialog({
  title: 'Open File',
  filters: [{ name: 'JSON', extensions: ['json'] }]
});

// 保存文件对话框
const savePath = await api.showSaveDialog({
  title: 'Save File',
  defaultPath: '/home/user/config.json'
});

// 消息对话框
const buttonIndex = await api.showMessageDialog({
  type: 'question',
  message: 'Are you sure?',
  buttons: ['Yes', 'No']
});

// 错误对话框
await api.showErrorDialog('Error', 'Something went wrong');
```

### 配置操作 (ConfigOperations)

```typescript
// 加载配置
const config = await api.loadConfig();

// 保存配置
await api.saveConfig(config);

// 验证配置
const result = await api.validateConfig(config);
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}

// 重置配置
await api.resetConfig();
```

### 事件监听 (EventListeners)

```typescript
// 监听配置变化
const unsubscribe = api.onConfigChange((config) => {
  console.log('Config changed:', config);
});
unsubscribe(); // 停止监听

// 监听文件变化
const unsubFile = api.onFileChange('/path/to/file', (path, event) => {
  console.log(`File ${event}:`, path);
});

// 监听错误
const unsubError = api.onError((error) => {
  console.error('Error:', error);
});

// 监听应用就绪
const unsubReady = api.onAppReady(() => {
  console.log('App ready');
});
```

### 系统操作 (SystemOperations)

```typescript
// 应用信息
const version = await api.getAppVersion();
const platformInfo = await api.getPlatformInfo();

// 外部链接
await api.openExternal('https://example.com');

// 剪贴板
await api.copyToClipboard('text');
const text = await api.readFromClipboard();

// 窗口操作
await api.minimizeWindow();
await api.maximizeWindow();
await api.closeWindow();
```

## 集成示例

### FileService 集成

`src/lib/fileService.ts` 已更新以使用新的类型定义:

```typescript
import type { ElectronAPI } from '@/types/electron';

class ElectronFileService implements FileService {
  private api: ElectronAPI;

  constructor(api: ElectronAPI) {
    this.api = api;
  }

  async getConfigPath(): Promise<string> {
    return this.api.getConfigPath();
  }

  async readFile(path: string): Promise<string> {
    return this.api.readFile(path);
  }

  async writeFile(path: string, content: string): Promise<void> {
    await this.api.writeFile(path, content);
  }
}
```

### 完整的配置编辑器示例

```typescript
import { useElectronAPI } from '@/types/electron';
import type { OpenCodeConfig } from '@/types/config';
import { useState, useEffect } from 'react';

export function ConfigEditor() {
  const api = useElectronAPI();
  const [config, setConfig] = useState<OpenCodeConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!api) return;

    // 加载配置
    api.loadConfig()
      .then(setConfig)
      .catch(err => setError(err.message));

    // 监听变化
    const unsubscribe = api.onConfigChange(setConfig);
    return unsubscribe;
  }, [api]);

  const handleSave = async () => {
    if (!api || !config) return;

    try {
      // 验证配置
      const result = await api.validateConfig(config);
      if (!result.valid) {
        setError(`Validation failed: ${result.errors[0]?.message}`);
        return;
      }

      // 保存配置
      await api.saveConfig(config);
      
      // 显示成功消息
      await api.showMessageDialog({
        type: 'info',
        title: 'Success',
        message: 'Configuration saved successfully'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  if (!api) {
    return <div>Not running in Electron</div>;
  }

  if (!config) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {/* 配置编辑 UI */}
      <button onClick={handleSave}>Save</button>
    </div>
  );
}
```

## 类型定义详解

### ElectronAPI 接口

主接口，组合了所有 API 类别:

```typescript
export interface ElectronAPI
  extends FileOperations,
    DirectoryOperations,
    DialogOperations,
    ConfigOperations,
    EventListeners,
    SystemOperations {}
```

### 对话框选项类型

```typescript
// 打开文件对话框选项
export interface OpenDialogOptions {
  title?: string;
  defaultPath?: string;
  buttonLabel?: string;
  filters?: FileFilter[];
  properties?: ('openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles')[];
}

// 保存文件对话框选项
export interface SaveDialogOptions {
  title?: string;
  defaultPath?: string;
  buttonLabel?: string;
  filters?: FileFilter[];
  showsTagField?: boolean;
}

// 文件过滤器
export interface FileFilter {
  name: string;
  extensions: string[];
}

// 消息对话框选项
export interface MessageDialogOptions {
  type?: 'none' | 'info' | 'error' | 'question' | 'warning';
  title?: string;
  message: string;
  detail?: string;
  buttons?: string[];
  defaultId?: number;
  cancelId?: number;
}
```

### 验证结果类型

```typescript
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  path: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  path: string;
  message: string;
}
```

### 平台信息类型

```typescript
export interface PlatformInfo {
  platform: 'win32' | 'darwin' | 'linux';
  arch: string;
  version: string;
}
```

## 最佳实践

### 1. 始终检查可用性

```typescript
// ✅ 好的做法
if (isElectronAvailable()) {
  const api = getElectronAPI();
  // 使用 API
}

// ❌ 不好的做法
const api = window.electronAPI!; // 可能为 undefined
```

### 2. 使用类型导入

```typescript
// ✅ 好的做法 - 不会增加运行时开销
import type { ElectronAPI } from '@/types/electron';

// ❌ 不好的做法 - 增加包大小
import { ElectronAPI } from '@/types/electron';
```

### 3. 错误处理

```typescript
// ✅ 好的做法
try {
  const config = await api.loadConfig();
} catch (error) {
  console.error('Failed to load config:', error);
}

// ❌ 不好的做法
const config = await api.loadConfig(); // 可能抛出错误
```

### 4. 取消订阅监听器

```typescript
// ✅ 好的做法
useEffect(() => {
  const unsubscribe = api.onConfigChange(handleChange);
  return unsubscribe; // 清理
}, [api]);

// ❌ 不好的做法
api.onConfigChange(handleChange); // 内存泄漏
```

### 5. 使用 React Hooks

```typescript
// ✅ 好的做法 - 在 React 组件中
const api = useElectronAPI();

// ❌ 不好的做法 - 直接访问 window
const api = window.electronAPI;
```

### 6. 路径处理

```typescript
// ✅ 好的做法 - 使用绝对路径
const configPath = await api.getConfigPath();
const filePath = `${configPath}/config.json`;

// ❌ 不好的做法 - 使用相对路径
const filePath = './config.json';
```

## 向后兼容性

旧代码仍然可以工作，但建议迁移到新的类型定义:

```typescript
// 旧方式 (仍然有效)
import { ElectronAPI } from '@/types/electron';

// 新方式 (推荐)
import type { ElectronAPI } from '@/types/electron';
import { getElectronAPI, useElectronAPI } from '@/types/electron';
```

## 故障排除

### 问题: "Electron API is not available"

**原因:**
- 在非 Electron 环境中运行 (如浏览器)
- Preload 脚本尚未加载
- IPC 桥接未建立

**解决方案:**
```typescript
if (isElectronAvailable()) {
  const api = getElectronAPI();
  // 使用 API
}
```

### 问题: TypeScript 错误 "window.electronAPI is possibly undefined"

**原因:**
- 未导入类型定义
- 未检查可用性

**解决方案:**
```typescript
import type { ElectronAPI } from '@/types/electron';
import { useElectronAPI } from '@/types/electron';

const api = useElectronAPI();
if (api) {
  // 安全使用
}
```

### 问题: IPC 超时错误

**原因:**
- 主进程未处理 IPC 消息
- Preload 脚本未正确暴露 API
- 浏览器控制台有错误

**解决方案:**
1. 检查 `electron/preload.ts` 中的 IPC 处理
2. 检查 `electron/main.ts` 中的事件监听器
3. 查看浏览器开发者工具控制台

## 相关文件

- `src/types/electron.d.ts` - 完整的 Electron API 类型定义
- `src/types/electron.ts` - 向后兼容性包装
- `src/types/config.ts` - OpenCode 配置类型
- `src/types/ELECTRON_API.md` - 详细 API 文档
- `src/lib/fileService.ts` - 文件服务实现
- `electron/preload.ts` - Preload 脚本 (暴露 API)
- `electron/main.ts` - 主进程 IPC 处理

## 下一步

1. **更新现有代码** - 将现有的 Electron API 调用迁移到新的类型定义
2. **添加更多 API** - 根据需要扩展 `electron.d.ts` 中的接口
3. **实现 Preload 脚本** - 确保 `electron/preload.ts` 实现了所有定义的 API
4. **测试** - 在 Electron 和 Web 环境中测试代码

## 参考资源

- [Electron 官方文档](https://www.electronjs.org/docs)
- [TypeScript 类型定义最佳实践](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [IPC 通信模式](https://www.electronjs.org/docs/latest/tutorial/ipc)
