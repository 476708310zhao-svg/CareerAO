'use strict';
const COS = require('cos-nodejs-sdk-v5');
const path = require('path');
const fs = require('fs');

const ENV_ID = 'cloud1-7gacanhu5aba4520';

function getAllFiles(dir, base, result = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      getAllFiles(full, base, result);
    } else {
      result.push({ full, key: full.replace(base, '').replace(/\\/g, '/').replace(/^\//, '') });
    }
  }
  return result;
}

async function deploy() {
  const secretId  = process.env.CLOUDBASE_SECRET_ID;
  const secretKey = process.env.CLOUDBASE_SECRET_KEY;
  if (!secretId || !secretKey) {
    console.error('Missing CLOUDBASE_SECRET_ID or CLOUDBASE_SECRET_KEY');
    process.exit(1);
  }

  const cos = new COS({ SecretId: secretId, SecretKey: secretKey });

  // 自动找到对应 env 的 bucket
  const svc = await new Promise((res, rej) =>
    cos.getService({}, (e, d) => e ? rej(e) : res(d))
  );
  const bucket = svc.Buckets.find(b => b.Name.includes(ENV_ID));
  if (!bucket) {
    console.error('Bucket not found. Available:', svc.Buckets.map(b => b.Name).join(', '));
    process.exit(1);
  }
  const Bucket = bucket.Name;
  const Region = bucket.Location;
  console.log(`Bucket: ${Bucket}  Region: ${Region}`);

  const distPath = path.resolve(__dirname, '../dist');
  const files = getAllFiles(distPath, distPath);
  console.log(`Uploading ${files.length} files...`);

  for (const { full, key } of files) {
    await new Promise((res, rej) =>
      cos.putObject({ Bucket, Region, Key: key, Body: fs.createReadStream(full) },
        (e, d) => e ? rej(e) : res(d))
    );
    console.log(`✓ ${key}`);
  }
  console.log('Deploy complete!');
}

deploy().catch(err => {
  console.error('Deploy failed:', err.message || err);
  process.exit(1);
});
