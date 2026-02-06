// electron/ipc/file.ts
import { ipcMain, dialog } from 'electron';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

const buildCommandEnv = (): NodeJS.ProcessEnv => {
  const env = { ...process.env };
  const extraPaths: string[] = [];

  // Add opencode's default installation path
  extraPaths.push(path.join(os.homedir(), '.opencode', 'bin'));

  if (process.platform === 'darwin') {
    extraPaths.push('/usr/local/bin', '/opt/homebrew/bin', '/opt/homebrew/sbin');
  }

  if (process.platform !== 'win32') {
    extraPaths.push(path.join(os.homedir(), '.local', 'bin'));
  }

  if (extraPaths.length > 0) {
    env.PATH = [env.PATH, ...extraPaths].filter(Boolean).join(path.delimiter);
  }

  return env;
};

// 获取跨平台配置目录
// OpenCode 官方文档: ~/.config/opencode/ (所有平台统一)
// Windows: %USERPROFILE%\.config\opencode\
// macOS/Linux: ~/.config/opencode/
function getConfigDir(): string {
  const homeDir = os.homedir();
  return path.join(homeDir, '.config', 'opencode');
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

type OpencodeCommand = {
  command: string;
  args: string[];
};

const buildOpencodeCommands = (args: string[]): OpencodeCommand[] => {
  const commands: OpencodeCommand[] = [
    { command: 'opencode', args },
  ];

  if (process.platform === 'win32') {
    commands.unshift({ command: 'opencode.exe', args });
    commands.push({ command: 'opencode.cmd', args });
    commands.push({ command: 'npx.cmd', args: ['opencode', ...args] });
  } else {
    commands.push({ command: 'npx', args: ['opencode', ...args] });
  }

  return commands;
};

async function runOpencodeModels(provider?: string): Promise<string> {
  const args = ['models', ...(provider ? [provider] : [])];
  const commands = buildOpencodeCommands(args);
  let lastError: unknown = null;

  for (const { command, args: cmdArgs } of commands) {
    try {
      const result = await execFileAsync(command, cmdArgs, {
        timeout: 15000,
        maxBuffer: 1024 * 1024,
        env: buildCommandEnv(),
      });
      return result.stdout || '';
    } catch (error) {
      lastError = error;
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        continue;
      }
      throw error;
    }
  }

  if (lastError) {
    throw lastError;
  }
  throw new Error('opencode command not found');
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

  ipcMain.handle('opencode-models', async (_, provider?: string) => {
    return runOpencodeModels(provider);
  });
}
