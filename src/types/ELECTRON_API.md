# Electron API Type Definitions

Complete TypeScript type definitions for the Electron IPC API exposed to the renderer process.

## Overview

The `electron.d.ts` file provides comprehensive type safety for all Electron APIs available in the renderer process. It includes:

- **File Operations**: Read/write files, JSON operations
- **Directory Operations**: Path utilities, directory management
- **Dialog Operations**: File dialogs, message dialogs
- **Config Operations**: Load/save OpenCode configuration
- **Event Listeners**: Configuration change listeners, file watchers
- **System Operations**: App info, clipboard, window management

## Usage

### Basic Setup

The Electron API is exposed globally via `window.electronAPI`:

```typescript
import type { ElectronAPI } from '@/types/electron';

// Type-safe access
const api: ElectronAPI = window.electronAPI!;

// Or use the helper function
import { getElectronAPI } from '@/types/electron';
const api = getElectronAPI(); // Throws if not available
```

### File Operations

```typescript
// Read file as string
const content = await window.electronAPI!.readFile('/path/to/file.txt');

// Write file
await window.electronAPI!.writeFile('/path/to/file.txt', 'content');

// Read JSON
const config = await window.electronAPI!.readJSON<OpenCodeConfig>('/path/to/config.json');

// Write JSON
await window.electronAPI!.writeJSON('/path/to/config.json', config, true);

// Check if file exists
const exists = await window.electronAPI!.fileExists('/path/to/file.txt');

// Delete file
await window.electronAPI!.deleteFile('/path/to/file.txt');
```

### Directory Operations

```typescript
// Get config directory
const configPath = await window.electronAPI!.getConfigPath();

// Get home directory
const homePath = await window.electronAPI!.getHomePath();

// Get app data directory
const appDataPath = await window.electronAPI!.getAppDataPath();

// List directory contents
const files = await window.electronAPI!.listDirectory('/path/to/dir');

// Create directory
await window.electronAPI!.createDirectory('/path/to/new/dir');

// Check if directory exists
const exists = await window.electronAPI!.directoryExists('/path/to/dir');
```

### Dialog Operations

```typescript
// Open file dialog
const filePath = await window.electronAPI!.showOpenDialog({
  title: 'Open Config File',
  defaultPath: '/home/user',
  filters: [
    { name: 'JSON Files', extensions: ['json'] },
    { name: 'All Files', extensions: ['*'] }
  ],
  properties: ['openFile']
});

// Save file dialog
const savePath = await window.electronAPI!.showSaveDialog({
  title: 'Save Config',
  defaultPath: '/home/user/config.json',
  filters: [{ name: 'JSON Files', extensions: ['json'] }]
});

// Message dialog
const buttonIndex = await window.electronAPI!.showMessageDialog({
  type: 'question',
  title: 'Confirm',
  message: 'Are you sure?',
  buttons: ['Yes', 'No'],
  defaultId: 0
});

// Error dialog
await window.electronAPI!.showErrorDialog('Error', 'Something went wrong');
```

### Configuration Operations

```typescript
// Load configuration
const config = await window.electronAPI!.loadConfig();

// Save configuration
await window.electronAPI!.saveConfig(config);

// Get config file path
const configPath = await window.electronAPI!.getConfigFilePath();

// Validate configuration
const result = await window.electronAPI!.validateConfig(config);
if (!result.valid) {
  console.error('Validation errors:', result.errors);
  console.warn('Validation warnings:', result.warnings);
}

// Reset to defaults
await window.electronAPI!.resetConfig();
```

### Event Listeners

```typescript
// Listen for config changes
const unsubscribe = window.electronAPI!.onConfigChange((config) => {
  console.log('Config changed:', config);
});

// Stop listening
unsubscribe();

// Listen for file changes
const unsubscribeFile = window.electronAPI!.onFileChange(
  '/path/to/file.json',
  (path, event) => {
    console.log(`File ${event}:`, path);
  }
);

// Listen for errors
const unsubscribeError = window.electronAPI!.onError((error) => {
  console.error('Error:', error);
});

// Listen for app ready
const unsubscribeReady = window.electronAPI!.onAppReady(() => {
  console.log('App is ready');
});
```

### System Operations

```typescript
// Get app version
const version = await window.electronAPI!.getAppVersion();

// Get platform info
const platformInfo = await window.electronAPI!.getPlatformInfo();
console.log(`Running on ${platformInfo.platform} ${platformInfo.arch}`);

// Open external URL
await window.electronAPI!.openExternal('https://example.com');

// Clipboard operations
await window.electronAPI!.copyToClipboard('text to copy');
const clipboardText = await window.electronAPI!.readFromClipboard();

// Window operations
await window.electronAPI!.minimizeWindow();
await window.electronAPI!.maximizeWindow();
await window.electronAPI!.closeWindow();
```

## React Hooks

### useElectronAPI

Safe hook that returns `null` if Electron API is not available:

```typescript
import { useElectronAPI } from '@/types/electron';

function MyComponent() {
  const api = useElectronAPI();

  if (!api) {
    return <div>Not running in Electron</div>;
  }

  return <div>Electron API available</div>;
}
```

### useElectronAPIStrict

Hook that throws if Electron API is not available:

```typescript
import { useElectronAPIStrict } from '@/types/electron';

function MyComponent() {
  const api = useElectronAPIStrict(); // Throws if not available

  return <div>Using Electron API</div>;
}
```

## Type Guards

### isElectronAvailable

Check if Electron API is available:

```typescript
import { isElectronAvailable, getElectronAPI } from '@/types/electron';

if (isElectronAvailable()) {
  const api = getElectronAPI();
  // Use API
}
```

## Integration with FileService

The `fileService.ts` uses the Electron API types:

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

## Type Definitions

### ElectronAPI

Main interface combining all API categories:

```typescript
export interface ElectronAPI
  extends FileOperations,
    DirectoryOperations,
    DialogOperations,
    ConfigOperations,
    EventListeners,
    SystemOperations {}
```

### FileOperations

```typescript
export interface FileOperations {
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<void>;
  readJSON: <T = any>(path: string) => Promise<T>;
  writeJSON: <T = any>(path: string, data: T, pretty?: boolean) => Promise<void>;
  fileExists: (path: string) => Promise<boolean>;
  deleteFile: (path: string) => Promise<void>;
}
```

### DirectoryOperations

```typescript
export interface DirectoryOperations {
  getConfigPath: () => Promise<string>;
  getHomePath: () => Promise<string>;
  getAppDataPath: () => Promise<string>;
  listDirectory: (dirPath: string) => Promise<string[]>;
  createDirectory: (dirPath: string) => Promise<void>;
  directoryExists: (dirPath: string) => Promise<boolean>;
}
```

### DialogOperations

```typescript
export interface DialogOperations {
  showOpenDialog: (options?: OpenDialogOptions) => Promise<string | null>;
  showSaveDialog: (options?: SaveDialogOptions) => Promise<string | null>;
  showMessageDialog: (options: MessageDialogOptions) => Promise<number>;
  showErrorDialog: (title: string, message: string) => Promise<void>;
}
```

### ConfigOperations

```typescript
export interface ConfigOperations {
  loadConfig: () => Promise<OpenCodeConfig>;
  saveConfig: (config: OpenCodeConfig) => Promise<void>;
  getConfigFilePath: () => Promise<string>;
  validateConfig: (config: OpenCodeConfig) => Promise<ValidationResult>;
  resetConfig: () => Promise<void>;
}
```

### EventListeners

```typescript
export interface EventListeners {
  onConfigChange: (callback: ConfigChangeCallback) => () => void;
  onFileChange: (path: string, callback: FileChangeCallback) => () => void;
  onError: (callback: ErrorCallback) => () => void;
  onAppReady: (callback: () => void) => () => void;
}
```

### SystemOperations

```typescript
export interface SystemOperations {
  getAppVersion: () => Promise<string>;
  getPlatformInfo: () => Promise<PlatformInfo>;
  openExternal: (url: string) => Promise<void>;
  copyToClipboard: (text: string) => Promise<void>;
  readFromClipboard: () => Promise<string>;
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<void>;
  closeWindow: () => Promise<void>;
}
```

## Best Practices

1. **Always check availability**: Use `isElectronAvailable()` or `useElectronAPI()` before accessing the API
2. **Use type imports**: Import types with `import type` to avoid runtime overhead
3. **Error handling**: Wrap API calls in try-catch blocks
4. **Unsubscribe from listeners**: Always call the returned unsubscribe function
5. **Use React hooks**: Prefer `useElectronAPI()` in React components
6. **Path handling**: Always use absolute paths for file operations

## Example: Complete Config Editor

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

    // Load config on mount
    api.loadConfig()
      .then(setConfig)
      .catch(err => setError(err.message));

    // Listen for changes
    const unsubscribe = api.onConfigChange(setConfig);
    return unsubscribe;
  }, [api]);

  const handleSave = async () => {
    if (!api || !config) return;

    try {
      const result = await api.validateConfig(config);
      if (!result.valid) {
        setError(`Validation failed: ${result.errors[0]?.message}`);
        return;
      }

      await api.saveConfig(config);
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
      {/* Config editor UI */}
      <button onClick={handleSave}>Save</button>
    </div>
  );
}
```

## Troubleshooting

### "Electron API is not available"

This error occurs when:
- Running in a non-Electron environment (web browser)
- The preload script hasn't loaded yet
- The IPC bridge hasn't been established

**Solution**: Check `isElectronAvailable()` before using the API

### TypeScript errors about `window.electronAPI`

Make sure the `electron.d.ts` file is included in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./src/types"]
  },
  "include": ["src"]
}
```

### IPC timeout errors

If API calls timeout:
- Check that the main process is handling the IPC messages
- Verify the preload script is correctly exposing the API
- Check browser console for errors

## Related Files

- `src/types/config.ts` - OpenCode configuration types
- `src/lib/fileService.ts` - File service implementation
- `electron/preload.ts` - Preload script that exposes the API
- `electron/main.ts` - Main process IPC handlers
