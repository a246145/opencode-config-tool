/**
 * 自定义 macOS 签名脚本
 * 在签名前清理扩展属性
 */
const { execSync } = require('child_process');
const { signAsync } = require('@electron/osx-sign');

exports.default = async function(opts, packager) {
  const appPath = opts.app;
  
  console.log(`  • [customSign] Cleaning and signing: ${appPath}`);
  
  try {
    // 清理扩展属性
    execSync(`xattr -cr "${appPath}"`, { stdio: 'pipe' });
    console.log(`  • [customSign] Extended attributes cleaned`);
    
    // 使用 @electron/osx-sign 进行签名
    await signAsync(opts);
    
    console.log(`  • [customSign] Signed successfully`);
  } catch (error) {
    console.error(`  • [customSign] Error:`, error.message);
    throw error;
  }
};
