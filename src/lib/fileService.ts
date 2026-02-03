// src/lib/fileService.ts

import type { ElectronAPI } from '@/types/electron';

export interface FileService {
  getConfigPath(): Promise<string>;
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
}

/**
 * Electron 环境文件服务
 * 使用 IPC 与主进程通信
 */
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

// Web 环境 (通过 API)
class WebFileService implements FileService {
  private baseUrl = '';

  async getConfigPath(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/config/path`);
    const data = await response.json();
    return data.path;
  }

  async readFile(path: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/config?path=${encodeURIComponent(path)}`);
    return response.text();
  }

  async writeFile(path: string, content: string): Promise<void> {
    await fetch(`${this.baseUrl}/api/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, content }),
    });
  }
}

/**
 * 检测环境并返回对应的服务
 */
export function getFileService(): FileService {
  if (typeof window !== 'undefined' && window.electronAPI) {
    return new ElectronFileService(window.electronAPI);
  }
  return new WebFileService();
}

export const fileService = getFileService();
