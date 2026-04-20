'use strict';
const COS = require('cos-nodejs-sdk-v5');
const path = require('path');
const fs = require('fs');
const https = require('https');
const crypto = require('crypto');

const ENV_ID = 'cloud1-7gacanhu5aba4520';
const HOSTING_DOMAIN = `${ENV_ID}.tcloudbaseapp.com`;

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
  console.log('Upload complete! Purging CDN cache...');
  await purgeCdn(secretId, secretKey);
  console.log('Deploy complete!');
}

function tencentApiRequest(secretId, secretKey, service, action, payload) {
  return new Promise((resolve, reject) => {
    const host = `${service}.tencentcloudapi.com`;
    const body = JSON.stringify(payload);
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const date = new Date(timestamp * 1000).toISOString().slice(0, 10);

    const signedHeaders = 'content-type;host';
    const hashedPayload = crypto.createHash('sha256').update(body).digest('hex');
    const canonicalRequest = ['POST', '/', '', `content-type:application/json\nhost:${host}\n`, signedHeaders, hashedPayload].join('\n');
    const credentialScope = `${date}/${service}/tc3_request`;
    const stringToSign = ['TC3-HMAC-SHA256', timestamp, credentialScope, crypto.createHash('sha256').update(canonicalRequest).digest('hex')].join('\n');

    const hmac = (key, msg) => crypto.createHmac('sha256', key).update(msg).digest();
    const secretDate = hmac(`TC3${secretKey}`, date);
    const secretService = hmac(secretDate, service);
    const secretSigning = hmac(secretService, 'tc3_request');
    const signature = crypto.createHmac('sha256', secretSigning).update(stringToSign).digest('hex');

    const authorization = `TC3-HMAC-SHA256 Credential=${secretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const options = {
      hostname: host, path: '/', method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Host': host,
        'X-TC-Action': action,
        'X-TC-Version': '2018-06-06',
        'X-TC-Timestamp': timestamp,
        'Authorization': authorization,
      }
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function purgeCdn(secretId, secretKey) {
  try {
    const result = await tencentApiRequest(secretId, secretKey, 'cdn', 'PurgePathCache', {
      Paths: [`https://${HOSTING_DOMAIN}/`],
      FlushType: 'flush',
    });
    if (result.Response && result.Response.Error) {
      console.warn('CDN purge warning:', result.Response.Error.Message);
    } else {
      console.log('CDN cache purged, TaskId:', result.Response && result.Response.TaskId);
    }
  } catch (e) {
    console.warn('CDN purge failed (non-fatal):', e.message);
  }
}

deploy().catch(err => {
  console.error('Deploy failed:', err.message || err);
  process.exit(1);
});
