'use strict';
const cloudbase = require('@cloudbase/node-sdk');
const path = require('path');
const fs = require('fs');

const ENV_ID = 'cloud1-7gacanhu5aba4520';

async function deploy() {
  const secretId = process.env.CLOUDBASE_SECRET_ID;
  const secretKey = process.env.CLOUDBASE_SECRET_KEY;

  if (!secretId || !secretKey) {
    console.error('Missing CLOUDBASE_SECRET_ID or CLOUDBASE_SECRET_KEY');
    process.exit(1);
  }

  const app = cloudbase.init({ secretId, secretKey, env: ENV_ID });
  const hosting = app.hosting();
  const distPath = path.resolve(__dirname, '../dist');

  if (!fs.existsSync(distPath)) {
    console.error('dist/ folder not found');
    process.exit(1);
  }

  console.log('Uploading to CloudBase hosting...');
  await hosting.uploadFiles({
    localPath: distPath,
    cloudPath: '/',
    onProgress: ({ loaded, total }) => {
      const pct = total ? Math.round((loaded / total) * 100) : '?';
      process.stdout.write(`\rProgress: ${pct}%`);
    }
  });

  console.log('\nDeploy complete!');
}

deploy().catch(err => {
  console.error('\nDeploy failed:', err.message || err);
  process.exit(1);
});
