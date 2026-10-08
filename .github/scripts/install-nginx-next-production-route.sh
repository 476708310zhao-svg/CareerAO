#!/usr/bin/env bash
set -euo pipefail

MARKER_BEGIN="# BEGIN CareerAO Next production route"
MARKER_END="# END CareerAO Next production route"
UPSTREAM="${NEXT_PRODUCTION_UPSTREAM:-http://127.0.0.1:3102}"

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
      match="$(grep -RslE 'server_name[[:space:]][^;]*(www\.)?zhiyincareer\.com([[:space:];]|$)' "$dir" 2>/dev/null | head -n 1 || true)"
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

python3 - "$CONF" "$UPSTREAM" "$MARKER_BEGIN" "$MARKER_END" <<'PY'
from pathlib import Path
import re
import sys

conf_path = Path(sys.argv[1])
upstream = sys.argv[2]
marker_begin = sys.argv[3]
marker_end = sys.argv[4]

route = f"""
    {marker_begin}
    location / {{
        proxy_pass {upstream};
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 90s;
        proxy_cache_bypass 1;
        proxy_no_cache 1;
        proxy_hide_header Cache-Control;
        add_header Cache-Control "no-store, no-cache, must-revalidate" always;
    }}
    {marker_end}
"""

text = conf_path.read_text(encoding="utf-8")

def matching_brace(source: str, opening: int) -> int:
    depth = 0
    quote = None
    escaped = False
    in_comment = False
    for index in range(opening, len(source)):
        char = source[index]
        if in_comment:
            if char == "\n":
                in_comment = False
            continue
        if escaped:
            escaped = False
            continue
        if char == "\\":
            escaped = True
            continue
        if quote:
            if char == quote:
                quote = None
            continue
        if char in ('"', "'"):
            quote = char
        elif char == "#":
            in_comment = True
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return index
    raise SystemExit("Unbalanced braces in Nginx configuration")

def server_blocks(source: str):
    blocks = []
    cursor = 0
    while True:
        match = re.search(r"\bserver\s*\{", source[cursor:])
        if not match:
            return blocks
        start = cursor + match.start()
        opening = source.find("{", start)
        closing = matching_brace(source, opening)
        blocks.append((start, closing))
        cursor = closing + 1

def remove_marked_route(block: str) -> str:
    while marker_begin in block and marker_end in block:
        marker_start = block.index(marker_begin)
        line_start = block.rfind("\n", 0, marker_start) + 1
        marker_finish = block.index(marker_end, marker_start) + len(marker_end)
        line_end = block.find("\n", marker_finish)
        if line_end == -1:
            line_end = len(block)
        block = block[:line_start] + block[line_end + (line_end < len(block)):]
    return block

def depth_at(source: str, target: int) -> int:
    depth = 0
    quote = None
    escaped = False
    in_comment = False
    for char in source[:target]:
        if in_comment:
            if char == "\n":
                in_comment = False
            continue
        if escaped:
            escaped = False
            continue
        if char == "\\":
            escaped = True
            continue
        if quote:
            if char == quote:
                quote = None
            continue
        if char in ('"', "'"):
            quote = char
        elif char == "#":
            in_comment = True
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
    return depth

def remove_direct_root_locations(block: str) -> str:
    pattern = re.compile(r"(?m)^[ \t]*location[ \t]+/[ \t]*\{")
    while True:
        target = next((match for match in pattern.finditer(block) if depth_at(block, match.start()) == 1), None)
        if not target:
            return block
        opening = block.find("{", target.start())
        closing = matching_brace(block, opening)
        line_end = block.find("\n", closing)
        if line_end == -1:
            line_end = closing + 1
        else:
            line_end += 1
        block = block[:target.start()] + block[line_end:]

targets = []
for start, end in server_blocks(text):
    block = text[start:end + 1]
    if re.search(r"server_name\s+[^;]*\b(?:www\.)?zhiyincareer\.com\b[^;]*;", block):
        targets.append((start, end))

if not targets:
    raise SystemExit("Could not find a zhiyincareer.com server block")

for start, end in reversed(targets):
    block = text[start:end + 1]
    block = remove_marked_route(block)
    block = remove_direct_root_locations(block)
    closing = block.rfind("}")
    block = block[:closing] + "\n" + route.rstrip("\n") + "\n" + block[closing:]
    text = text[:start] + block + text[end + 1:]

conf_path.write_text(text, encoding="utf-8")
PY

if nginx -t; then
  nginx -s reload || systemctl reload nginx
  echo "Installed Next production route in $CONF"
else
  cp "$BACKUP" "$CONF"
  nginx -t || true
  echo "Nginx production route install failed; restored $BACKUP" >&2
  exit 1
fi
