// CloudBase 静态托管部署脚本
// 使用 @cloudbase/node-sdk 直接上传，无需 tcb login
const cloudbase = require('@cloudbase/node-sdk');
const path = require('path');

const ENV_ID = 'cloud1-7gacanhu5aba4520';

async function deploy() {
  const secretId = process.env.CLOUDBASE_SECRET_ID;
  const secretKey = process.env.CLOUDBASE_SECRET_KEY;

  if (!secretId || !secretKey) {
    console.error('❌ 缺少 CLOUDBASE_SECRET_ID 或 CLOUDBASE_SECRET_KEY 环境变量');
    process.exit(1);
  }

  console.log('🔑 初始化 CloudBase SDK...');
  const app = cloudbase.init({ secretId, secretKey, env: ENV_ID });
  const hosting = app.hosting();

  const distPath = path.resolve(__dirname, '../dist');
  console.log(`📦 上传 ${distPath} 到 CloudBase 静态托管...`);

  await hosting.uploadFiles({
    localPath: distPath,
    cloudPath: '/',
    onProgress: ({ loaded, total }) => {
      const pct = total ? Math.round((loaded / total) * 100) : 0;
      process.stdout.write(`\r进度: ${pct}%`);
    },
    onFileFinish: (err, res, file) => {
      if (err) console.error(`\n❌ 上传失败: ${file.Key}`, err.message);
    }
  });

  console.log('\n✅ 部署完成！');
}

deploy().catch(err => {
  console.error('❌ 部署失败:', err.message || err);
  process.exit(1);
});
