# AI Studio / Gemini Sync Guide

This project can accept visual and page-copy changes from AI Studio exports, but production guardrails must stay owned by this repo.

## Recommended Flow

1. Let AI Studio / Gemini work on visual layout, copy, and page-level content.
2. Export the changed project as a ZIP.
3. Give the ZIP path to Codex for review and merge.
4. Codex compares the ZIP against the repo, keeps safe UI changes, and rejects dangerous regressions.
5. Run `npm run verify` before committing or pushing.

## Files Gemini Should Not Change

Do not accept changes to these files from an AI Studio export unless they are reviewed manually:

- `.github/workflows/deploy.yml`
- `.github/workflows/guard.yml`
- `AGENTS.md`
- `src/lib/api.ts`
- `src/pages/Jobs.tsx`
- `public/robots.txt`
- `public/sitemap.xml`
- `index.html`
- dependency removals in `package.json`

## Local Safety Check

Run:

```bash
npm run verify
```

This now runs:

- `npm run guard`
- `npm run lint`
- `npm run build`

The guard step checks the production workflow files, API base URL, real SEO domain, site verification metadata, and Jobs page data source.
