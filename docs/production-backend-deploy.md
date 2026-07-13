# Production Backend Deploy

The existing `Build & Deploy to Server` workflow only publishes the static `dist/` directory.
`Deploy Backend API` publishes the Express backend and reloads it with PM2.

## GitHub secrets and variables

Required secrets:

- `SSH_PRIVATE_KEY`
- `SSH_HOST`
- `SSH_USER`
- `GEMINI_API_KEY`

Optional secrets:

- `REAL_API_BASE_URL`

Optional repository variables:

- `ENABLE_RESUME_TAILOR_AI`

## Server process

The backend is deployed to:

```text
/www/wwwroot/zhiyincareer-api/current
```

PM2 process name:

```text
zhiyincareer-api
```

Default port:

```text
3000
```

## Nginx route

The backend deployment installs this exact API route automatically when Nginx config is discoverable.
It intentionally only proxies the resume-tailor API prefix so existing production API routes can keep using the current backend.

```nginx
location ^~ /api/proxy/resume-tailor/ {
  proxy_pass http://127.0.0.1:3000;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

Static files can continue to be served from `/www/wwwroot/zhiyincareer-web`.
