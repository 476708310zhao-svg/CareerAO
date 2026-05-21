# CareerAO Official Site

职引官网代码仓库，服务于 [https://www.zhiyincareer.com](https://www.zhiyincareer.com)。项目包含官网首页、职位搜索、AI 面试、网申助手、简历工具、薪资查询、校招日历、内容资源与用户认证等模块。

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Express + tsx development server
- Firebase Auth / Firestore
- Gemini API
- Tailwind CSS v4

## Local Setup

Prerequisites:

- Node.js 22+
- npm

Install dependencies:

```bash
npm install --legacy-peer-deps
```

`react-simple-maps@3.0.0` declares React peer support only up to React 18, while this project uses React 19. Use `--legacy-peer-deps` for the current dependency baseline.

Create a local env file:

```bash
cp .env.example .env.local
```

Then fill the values required by the feature you are testing.

Start the development server:

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev       # Start Express + Vite dev server
npm run lint      # TypeScript type check
npm run build     # Production build
npm run preview   # Preview the Vite build
npm run verify    # Run lint and build
```

## Environment Variables

See [.env.example](.env.example) for the full template.

- `GEMINI_API_KEY`: Enables Gemini-powered resume polish and AI interview routes.
- `APP_URL`: Public app URL used by hosted environments for self-referential links or callbacks.
- `VITE_API_BASE_URL`: Browser API base in production. Keep production pointed at `https://www.zhiyincareer.com` unless the deployment explicitly provides another backend URL.
- `REAL_API_BASE_URL`: Server-side proxy target for mini-program/backend APIs. Local fallback is `http://localhost:3001`.

Never commit `.env.local` or any real secret. `.env*` files are ignored except `.env.example`.

## Production Guardrails

Read [AGENTS.md](AGENTS.md) before changing production-sensitive files. In particular:

- Do not delete or rewrite `.github/workflows/deploy.yml` or `.github/workflows/guard.yml`.
- Keep `src/lib/api.ts` API base logic exactly as required by `AGENTS.md`.
- Keep SEO files on the real `https://www.zhiyincareer.com` domain.
- Do not remove existing dependencies from `package.json`.

## Development Checklist

Before handing off or deploying a change:

```bash
npm run lint
npm run build
```

For user-facing changes, also check:

- Homepage first viewport
- Desktop and mobile navigation
- `/jobs` and `/jobs/:id`
- Login/register modal
- Any page directly touched by the change

## Notes

The production build may warn about large chunks and mixed static/dynamic imports around Firebase or API modules. These are known baseline warnings and do not fail the build.
