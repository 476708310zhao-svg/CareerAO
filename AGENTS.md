# AI Agent Instructions — MUST READ BEFORE ANY COMMIT

## ⛔ ABSOLUTE RULES — NEVER VIOLATE

### Rule 1: GitHub Workflows
**NEVER** delete, modify, or recreate `.github/workflows/deploy.yml` or `.github/workflows/guard.yml`.
These are production CI/CD files. Deleting them breaks the auto-deploy pipeline permanently.

### Rule 2: API Base URL in src/lib/api.ts
This file MUST always contain exactly this code — do not change it:
```ts
export const API_BASE = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_BASE_URL ?? 'https://www.zhiyincareer.com');
```
- Use `??` NOT `||`
- Fallback MUST be `https://www.zhiyincareer.com` NOT `localhost:3000`

### Rule 3: Jobs Page (src/pages/Jobs.tsx)
- MUST fetch from `/api/proxy/jobs` — do NOT revert to mock data or Firestore
- Do NOT import `firestore_api` or use `MOCK_JOBS` in this file

### Rule 4: SEO Files — Real Domain Only
- `public/sitemap.xml` → domain is `https://www.zhiyincareer.com` — do NOT change to `yourdomain.com`
- `public/robots.txt` → Sitemap points to `https://www.zhiyincareer.com/sitemap.xml`
- `index.html` → contains real verification codes for Google/Baidu/Sogou — do NOT remove them

### Rule 5: Dependencies
NEVER remove existing entries from `package.json`. You may only add new ones.

### Rule 6: This File (AGENTS.md)
Do NOT simplify, shorten, or rewrite this file. Keep all rules intact.
