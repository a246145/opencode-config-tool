// src/types/electron.ts

/**
 * Electron API 类型定义 (Re-export)
 *
 * 此文件从 electron.d.ts 重新导出所有类型
 * 提供统一的导入入口点
 *
 * 与 electron/preload.ts 中的 contextBridge.exposeInMainWorld 保持一致
 */

// 导出完整的 Electron API 类型和工具函数
export type { ElectronAPI } from './electron.d';
export { isElectronAvailable, getElectronAPI, useElectronAPI, useElectronAPIStrict } from './electron.d';
