#!/usr/bin/env bash
set -euo pipefail

MARKER_BEGIN="# BEGIN CareerAO resume-tailor API route"
MARKER_END="# END CareerAO resume-tailor API route"
UPSTREAM="${RESUME_TAILOR_UPSTREAM:-http://127.0.0.1:3000}"

find_nginx_conf() {
  if [ -n "${NGINX_CONF:-}" ] && [ -f "$NGINX_CONF" ]; then
    printf '%s\n' "$NGINX_CONF"
    return 0
  fi

  for candidate in \
    /www/server/panel/vhost/nginx/www.zhiyincareer.com.conf \
    /www/server/panel/vhost/nginx/zhiyincareer.com.conf \
    /www/server/nginx/conf/vhost/www.zhiyincareer.com.conf \
    /www/server/nginx/conf/vhost/zhiyincareer.com.conf \
    /etc/nginx/sites-enabled/www.zhiyincareer.com \
    /etc/nginx/sites-enabled/zhiyincareer.com; do
    if [ -f "$candidate" ]; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done

  for dir in /www/server/panel/vhost/nginx /www/server/nginx/conf/vhost /etc/nginx/sites-enabled /etc/nginx/conf.d; do
    if [ -d "$dir" ]; then
      match="$(grep -RslE 'server_name[[:space:]][^;]*(^|[[:space:]])www\.zhiyincareer\.com([[:space:];]|$)' "$dir" 2>/dev/null | head -n 1 || true)"
      if [ -n "$match" ]; then
        printf '%s\n' "$match"
        return 0
      fi
    fi
  done

  for dir in /www/server/panel/vhost/nginx /www/server/nginx/conf/vhost /etc/nginx/sites-enabled /etc/nginx/conf.d; do
    if [ -d "$dir" ]; then
      match="$(grep -RslE 'server_name[[:space:]][^;]*(^|[[:space:]])zhiyincareer\.com([[:space:];]|$)' "$dir" 2>/dev/null | head -n 1 || true)"
      if [ -n "$match" ]; then
        printf '%s\n' "$match"
        return 0
      fi
    fi
  done

  return 1
}

CONF="$(find_nginx_conf)"
BACKUP="${CONF}.bak.$(date +%Y%m%d%H%M%S)"
cp "$CONF" "$BACKUP"

STALE_FILES=()
for dir in /www/server/panel/vhost/nginx /www/server/nginx/conf/vhost /etc/nginx/sites-enabled /etc/nginx/conf.d; do
  if [ -d "$dir" ]; then
    while IFS= read -r stale; do
      if [ "$stale" != "$CONF" ]; then
        STALE_FILES+=("$stale")
        cp "$stale" "${stale}.bak.$(date +%Y%m%d%H%M%S)"
      fi
    done < <(grep -RslF "$MARKER_BEGIN" "$dir" 2>/dev/null || true)
  fi
done

python3 - "$CONF" "$UPSTREAM" "$MARKER_BEGIN" "$MARKER_END" "${STALE_FILES[@]}" <<'PY'
from pathlib import Path
import sys

conf_path = Path(sys.argv[1])
upstream = sys.argv[2]
marker_begin = sys.argv[3]
marker_end = sys.argv[4]
stale_paths = [Path(value) for value in sys.argv[5:]]

route = f"""
    {marker_begin}
    location ^~ /api/proxy/resume-tailor/ {{
        client_max_body_size 6m;
        proxy_pass {upstream};
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 60s;
    }}
    {marker_end}
"""

text = conf_path.read_text(encoding="utf-8")
if marker_begin in text and marker_end in text:
    start = text.index(marker_begin)
    line_start = text.rfind("\n", 0, start) + 1
    end = text.index(marker_end, start) + len(marker_end)
    line_end = text.find("\n", end)
    if line_end == -1:
        line_end = len(text)
    text = text[:line_start] + route.strip("\n") + text[line_end:]
else:
    insert_at = text.rfind("\n}")
    if insert_at == -1:
        raise SystemExit("Could not find the end of the nginx server block.")
    text = text[:insert_at] + "\n" + route.rstrip("\n") + text[insert_at:]

conf_path.write_text(text, encoding="utf-8")

for stale_path in stale_paths:
    stale_text = stale_path.read_text(encoding="utf-8")
    if marker_begin not in stale_text or marker_end not in stale_text:
        continue
    start = stale_text.index(marker_begin)
    line_start = stale_text.rfind("\n", 0, start) + 1
    end = stale_text.index(marker_end, start) + len(marker_end)
    line_end = stale_text.find("\n", end)
    if line_end == -1:
        line_end = len(stale_text)
    stale_path.write_text(stale_text[:line_start] + stale_text[line_end + 1 :], encoding="utf-8")
PY

if nginx -t; then
  nginx -s reload || systemctl reload nginx
  echo "Installed resume-tailor nginx route in $CONF"
  for stale in "${STALE_FILES[@]}"; do
    echo "Removed stale resume-tailor nginx route from $stale"
  done
else
  cp "$BACKUP" "$CONF"
  nginx -t || true
  echo "Nginx route install failed; restored $BACKUP" >&2
  exit 1
fi
