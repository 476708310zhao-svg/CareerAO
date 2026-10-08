"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, clearSessionStorage, readToken } from "@/lib/api-client";

export type AuthUser = { id?: number; nickname?: string; email?: string; phone?: string };

type AuthContextValue = {
  ready: boolean;
  token: string | null;
  user: AuthUser | null;
  saveSession: (token: string, user?: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setToken(readToken());
    try {
      const raw = window.localStorage.getItem(AUTH_USER_KEY);
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    }
    setReady(true);
  }, []);

  const saveSession = useCallback((nextToken: string, nextUser: AuthUser = {}) => {
    window.localStorage.setItem(AUTH_TOKEN_KEY, nextToken);
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    clearSessionStorage();
    setToken(null);
    setUser(null);
    if (pathname !== "/") router.replace("/login");
  }, [pathname, router]);

  useEffect(() => {
    window.addEventListener("zhiyin:unauthorized", logout);
    return () => window.removeEventListener("zhiyin:unauthorized", logout);
  }, [logout]);

  const value = useMemo(() => ({ ready, token, user, saveSession, logout }), [ready, token, user, saveSession, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}

export function AuthGate({ children, title = "登录后继续使用" }: { children: React.ReactNode; title?: string }) {
  const { ready, token } = useAuth();
  if (!ready) return <div className="zy-state-card" role="status">正在确认登录状态…</div>;
  if (!token) {
    return (
      <section className="zy-auth-gate" aria-labelledby="auth-gate-title">
        <span className="zy-icon-box"><LockKeyhole size={22} aria-hidden="true" /></span>
        <h2 id="auth-gate-title">{title}</h2>
        <p>登录后可在电脑端管理申请、简历和 AI 会话，并与小程序同步。</p>
        <div><Link className="zy-button zy-button-primary" href="/login">登录工作台</Link><Link className="zy-button zy-button-secondary" href="/register">创建账号</Link></div>
      </section>
    );
  }
  return <>{children}</>;
}
