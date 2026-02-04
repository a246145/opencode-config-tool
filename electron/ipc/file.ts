// electron/ipc/file.ts
import { ipcMain, dialog } from 'electron';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

// 获取跨平台配置目录
function getConfigDir(): string {
  const homeDir = os.homedir();
  const platform = process.platform;

  if (platform === 'win32') {
    // Windows: %LOCALAPPDATA%\opencode 或 %APPDATA%\opencode
    return path.join(process.env.LOCALAPPDATA || path.join(homeDir, 'AppData', 'Local'), 'opencode');
  } else if (platform === 'darwin') {
    // macOS: ~/.config/opencode
    return path.join(homeDir, '.config', 'opencode');
  } else {
    // Linux: ~/.config/opencode (遵循 XDG 规范)
    return path.join(process.env.XDG_CONFIG_HOME || path.join(homeDir, '.config'), 'opencode');
  }
}

// 获取默认 OpenCode 配置路径
function getDefaultConfigPath(): string {
  return path.join(getConfigDir(), 'opencode.json');
}

// 获取默认 Oh My OpenCode 配置路径
function getOmoConfigPath(): string {
  return path.join(getConfigDir(), 'oh-my-opencode.json');
}

// 确保目录存在
async function ensureDir(filePath: string): Promise<void> {
  const dir = path.dirname(filePath);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

export function setupFileIpc(): void {
  // 获取配置路径
  ipcMain.handle('get-config-path', () => {
    return getDefaultConfigPath();
  });

  // 获取 Oh My OpenCode 配置路径
  ipcMain.handle('get-omo-config-path', () => {
    return getOmoConfigPath();
  });

  // 获取配置目录
  ipcMain.handle('get-config-dir', () => {
    return getConfigDir();
  });

  // 读取文件
  ipcMain.handle('read-file', async (_, filePath: string) => {
    try {
      // 展开 ~ 为 home 目录
      const expandedPath = filePath.replace(/^~/, os.homedir());
      const content = await fs.readFile(expandedPath, 'utf-8');
      return content;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // 文件不存在，返回空配置
        return JSON.stringify({ "$schema": "https://opencode.ai/config.json" }, null, 2);
      }
      throw error;
    }
  });

  // 写入文件
  ipcMain.handle('write-file', async (_, filePath: string, content: string) => {
    const expandedPath = filePath.replace(/^~/, os.homedir());
    await ensureDir(expandedPath);
    await fs.writeFile(expandedPath, content, 'utf-8');
    return true;
  });

  // 打开文件对话框
  ipcMain.handle('open-file-dialog', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'JSON', extensions: ['json', 'jsonc'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });
    return result.canceled ? null : result.filePaths[0];
  });

  // 保存文件对话框
  ipcMain.handle('save-file-dialog', async (_, defaultPath?: string) => {
    const result = await dialog.showSaveDialog({
      defaultPath: defaultPath || 'opencode.json',
      filters: [
        { name: 'JSON', extensions: ['json'] },
      ],
    });
    return result.canceled ? null : result.filePath;
  });
}
