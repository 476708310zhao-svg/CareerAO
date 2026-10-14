const configuredSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.zhiyincareer.com").replace(/\/$/, "");

export const SITE_URL = configuredSiteUrl === "https://zhiyincareer.com"
  ? "https://www.zhiyincareer.com"
  : configuredSiteUrl;

export function absoluteUrl(pathname = "/") {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(normalizedPath, `${SITE_URL}/`).toString();
}

