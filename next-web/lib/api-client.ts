import { publicAsset } from "@/lib/base-path";

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "/backend").replace(/\/$/, "");

export const AUTH_TOKEN_KEY = "zhiyin_web_token";
export const AUTH_USER_KEY = "zhiyin_web_user";

export type ApiEnvelope<T> = {
  code?: number;
  message?: string;
  data?: T;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function readToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function clearSessionStorage() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
  window.sessionStorage.clear();
}

async function requestUrl<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = readToken();
  const isForm = options.body instanceof FormData;
  const headers = new Headers(options.headers);
  if (!isForm && options.body && !headers.has("content-type")) headers.set("content-type", "application/json");
  if (token) headers.set("authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new ApiError("暂时无法连接职引服务，请确认后端已启动后重试。", 0);
  }

  const payload = (await response.json().catch(() => ({}))) as ApiEnvelope<T>;
  if (response.status === 401) {
    clearSessionStorage();
    if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("zhiyin:unauthorized"));
  }
  if (!response.ok || payload.code === -1) {
    throw new ApiError(payload.message || `请求失败（${response.status}）`, response.status, payload.data);
  }
  return (payload.data ?? payload) as T;
}

export function apiRequest<T>(path: string, options: RequestInit = {}) {
  return requestUrl<T>(`${API_BASE_URL}${path}`, options);
}

export function localApiRequest<T>(path: string, options: RequestInit = {}) {
  return requestUrl<T>(publicAsset(path), options);
}

export function jsonBody(value: unknown) {
  return JSON.stringify(value);
}

export function createRequestId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `web_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}
