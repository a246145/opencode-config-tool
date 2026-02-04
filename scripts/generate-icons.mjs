#!/usr/bin/env node
/**
 * 图标生成脚本
 * 从 SVG 生成各平台所需的图标文件
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const buildDir = path.join(rootDir, 'build');
const iconsDir = path.join(buildDir, 'icons');

// 确保目录存在
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Linux 需要的尺寸
const sizes = [16, 32, 48, 64, 128, 256, 512, 1024];

async function generateIcons() {
  try {
    // 动态导入 sharp
    const sharp = (await import('sharp')).default;

    const svgPath = path.join(buildDir, 'icon.svg');
    const svgBuffer = fs.readFileSync(svgPath);

    console.log('🎨 开始生成图标...\n');

    // 生成各尺寸 PNG (用于 Linux 和 iconutil)
    for (const size of sizes) {
      const outputPath = path.join(iconsDir, `${size}x${size}.png`);
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`  ✅ ${size}x${size}.png`);
    }

    // 生成 icon.png (256x256 作为默认)
    const defaultPng = path.join(buildDir, 'icon.png');
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(defaultPng);
    console.log(`  ✅ icon.png (512x512)`);

    // macOS: 生成 .icns
    console.log('\n🍎 生成 macOS 图标...');
    await generateIcns(sharp, svgBuffer);

    // Windows: 生成 .ico
    console.log('\n🪟 生成 Windows 图标...');
    await generateIco(sharp, svgBuffer);

    console.log('\n✨ 所有图标生成完成！\n');

  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      console.log('📦 正在安装 sharp...');
      execSync('npm install sharp --save-dev', { cwd: rootDir, stdio: 'inherit' });
      console.log('🔄 请重新运行此脚本');
      process.exit(0);
    }
    throw error;
  }
}

async function generateIcns(sharp, svgBuffer) {
  const iconsetDir = path.join(buildDir, 'icon.iconset');

  // 创建 iconset 目录
  if (fs.existsSync(iconsetDir)) {
    fs.rmSync(iconsetDir, { recursive: true });
  }
  fs.mkdirSync(iconsetDir);

  // macOS iconset 需要的尺寸
  const icnsSize = [
    { name: 'icon_16x16.png', size: 16 },
    { name: 'icon_16x16@2x.png', size: 32 },
    { name: 'icon_32x32.png', size: 32 },
    { name: 'icon_32x32@2x.png', size: 64 },
    { name: 'icon_128x128.png', size: 128 },
    { name: 'icon_128x128@2x.png', size: 256 },
    { name: 'icon_256x256.png', size: 256 },
    { name: 'icon_256x256@2x.png', size: 512 },
    { name: 'icon_512x512.png', size: 512 },
    { name: 'icon_512x512@2x.png', size: 1024 },
  ];

  for (const { name, size } of icnsSize) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(iconsetDir, name));
  }

  // 使用 iconutil 生成 .icns
  try {
    execSync(`iconutil -c icns "${iconsetDir}" -o "${path.join(buildDir, 'icon.icns')}"`, {
      stdio: 'pipe'
    });
    console.log('  ✅ icon.icns');

    // 清理 iconset 目录
    fs.rmSync(iconsetDir, { recursive: true });
  } catch (error) {
    console.log('  ⚠️  iconutil 失败，请手动转换或在 macOS 上运行');
  }
}

async function generateIco(sharp, svgBuffer) {
  try {
    // 动态导入 png-to-ico
    const pngToIco = (await import('png-to-ico')).default;

    // ICO 需要的尺寸
    const icoSizes = [16, 32, 48, 64, 128, 256];
    const pngBuffers = [];

    for (const size of icoSizes) {
      const buffer = await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toBuffer();
      pngBuffers.push(buffer);
    }

    const icoBuffer = await pngToIco(pngBuffers);
    fs.writeFileSync(path.join(buildDir, 'icon.ico'), icoBuffer);
    console.log('  ✅ icon.ico');

  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      console.log('📦 正在安装 png-to-ico...');
      execSync('npm install png-to-ico --save-dev', { cwd: rootDir, stdio: 'inherit' });
      console.log('  ⚠️  请重新运行脚本以生成 .ico 文件');
    } else {
      console.log('  ⚠️  ICO 生成失败:', error.message);
    }
  }
}

generateIcons().catch(console.error);
