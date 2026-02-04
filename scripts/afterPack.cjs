const { execSync } = require('child_process');
const path = require('path');

exports.default = async function(context) {
  if (context.electronPlatformName !== 'darwin') {
    return;
  }

  const appName = `${context.packager.appInfo.productFilename}.app`;
  const appPath = path.join(context.appOutDir, appName);

  console.log('  • cleaning extended attributes for signing...');
  console.log(`  • app path: ${appPath}`);

  try {
    // 清除所有扩展属性
    execSync(`xattr -rc "${appPath}"`, {
      shell: '/bin/bash',
      stdio: 'pipe'
    });

    // 删除 .DS_Store 和 AppleDouble 文件
    execSync(`find "${appPath}" -name '.DS_Store' -delete 2>/dev/null || true`, {
      shell: '/bin/bash',
      stdio: 'pipe'
    });
    execSync(`find "${appPath}" -name '._*' -delete 2>/dev/null || true`, {
      shell: '/bin/bash',
      stdio: 'pipe'
    });

    // 验证清理结果
    try {
      const remaining = execSync(`find "${appPath}" -exec xattr {} \\; 2>/dev/null | grep -v '^$' | head -5`, {
        shell: '/bin/bash',
        encoding: 'utf8'
      }).trim();

      if (remaining) {
        console.log('  • warning: some extended attributes remain:');
        console.log(remaining.split('\n').map(l => '    ' + l).join('\n'));
      } else {
        console.log('  • all extended attributes cleaned successfully');
      }
    } catch (e) {
      console.log('  • all extended attributes cleaned successfully');
    }

  } catch (error) {
    console.error('  • error during cleanup:', error.message);
    throw error;
  }
};
