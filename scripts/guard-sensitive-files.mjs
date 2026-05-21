import { existsSync, readFileSync } from 'node:fs';

const checks = [];

const normalizeLineEndings = (content) => content.replace(/\r\n/g, '\n');

const read = (path) => normalizeLineEndings(readFileSync(path, 'utf8'));

const expectFile = (path) => {
  checks.push({
    name: `${path} exists`,
    pass: existsSync(path),
  });
};

const expectContains = (path, text, label) => {
  const content = existsSync(path) ? read(path) : '';
  checks.push({
    name: label,
    pass: content.includes(text),
  });
};

const expectNotContains = (path, text, label) => {
  const content = existsSync(path) ? read(path) : '';
  checks.push({
    name: label,
    pass: !content.includes(text),
  });
};

expectFile('.github/workflows/deploy.yml');
expectFile('.github/workflows/guard.yml');

expectContains(
  'src/lib/api.ts',
  `export const API_BASE = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_BASE_URL ?? 'https://www.zhiyincareer.com');`,
  'src/lib/api.ts keeps the production API fallback',
);

expectContains(
  'src/pages/Jobs.tsx',
  '/api/proxy/jobs',
  'Jobs page fetches from /api/proxy/jobs',
);
expectNotContains(
  'src/pages/Jobs.tsx',
  'MOCK_JOBS',
  'Jobs page does not use MOCK_JOBS',
);
expectNotContains(
  'src/pages/Jobs.tsx',
  'firestore_api',
  'Jobs page does not import firestore_api',
);

expectContains(
  'public/robots.txt',
  'Sitemap: https://www.zhiyincareer.com/sitemap.xml',
  'robots.txt points to the real sitemap URL',
);
expectContains(
  'public/sitemap.xml',
  'https://www.zhiyincareer.com/',
  'sitemap.xml uses the real domain',
);
expectNotContains(
  'public/sitemap.xml',
  'yourdomain.com',
  'sitemap.xml does not contain placeholder domains',
);
expectContains(
  'index.html',
  'google-site-verification',
  'index.html keeps Google verification metadata',
);
expectContains(
  'index.html',
  'baidu-site-verification',
  'index.html keeps Baidu verification metadata',
);
expectContains(
  'index.html',
  'sogou_site_verification',
  'index.html keeps Sogou verification metadata',
);

const failures = checks.filter((check) => !check.pass);

if (failures.length > 0) {
  console.error('Sensitive file guard failed:');
  for (const failure of failures) {
    console.error(`- ${failure.name}`);
  }
  process.exit(1);
}

console.log(`Sensitive file guard passed (${checks.length} checks).`);
