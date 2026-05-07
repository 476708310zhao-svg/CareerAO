# AI Agent Instructions

## ⚠️ CRITICAL — DO NOT VIOLATE THESE RULES

### 1. GitHub Workflows — NEVER TOUCH
- **NEVER** modify, delete, or recreate anything under `.github/workflows/`
- `deploy.yml` and `guard.yml` are production-critical CI/CD files
- These files were set up by the repo owner and must not be altered for any reason

### 2. API Base URL — NEVER CHANGE
- `src/lib/api.ts` must always use `??` (nullish coalescing), NOT `||`
- The fallback URL must always be `https://www.zhiyincareer.com`, NOT `localhost:3000`
- Correct version (do not change):
  ```ts
  export const API_BASE = import.meta.env.DEV
    ? ''
    : (import.meta.env.VITE_API_BASE_URL ?? 'https://www.zhiyincareer.com');
  ```

### 3. Jobs Page — Uses Real Backend API
- `src/pages/Jobs.tsx` fetches from `/api/proxy/jobs` — do NOT revert to mock data or Firestore
- Do NOT import from `../lib/firestore_api` in this file

### 4. SEO Files — Use Real Domain
- `public/sitemap.xml` and `public/robots.txt` must use `https://www.zhiyincareer.com`
- Do NOT replace with placeholder domains like `yourdomain.com` or `example.com`
- `index.html` contains real search engine verification codes — do NOT remove or replace them

### 5. Dependencies — Do Not Remove
- NEVER delete existing dependencies from `package.json`
- You may add new ones if explicitly needed
