// scripts/fix-preload.js
// Convert preload.js from ESM to CommonJS format for Electron compatibility

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const preloadPath = join(__dirname, '../dist-electron/preload.js');

try {
  let content = readFileSync(preloadPath, 'utf-8');

  // Replace ESM import with CommonJS require
  content = content.replace(
    /import\s*{\s*contextBridge\s*,\s*ipcRenderer\s*}\s*from\s*["']electron["'];?/,
    'const { contextBridge, ipcRenderer } = require("electron");'
  );

  // Remove any export statements
  content = content.replace(/export\s*{\s*};?\s*$/gm, '');
  content = content.replace(/export\s+default\s+.*$/gm, '');

  writeFileSync(preloadPath, content, 'utf-8');
  console.log('✓ Fixed preload.js to CommonJS format');
} catch (error) {
  console.error('Error fixing preload.js:', error.message);
  process.exit(1);
}
