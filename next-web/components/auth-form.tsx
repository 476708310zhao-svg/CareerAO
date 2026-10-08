"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, KeyRound, LockKeyhole, ShieldCheck, Smartphone } from "lucide-react";
import { apiRequest, jsonBody } from "@/lib/api-client";
import { useAuth, type AuthUser } from "./auth-provider";

type Session = { token: string; user: AuthUser };

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { saveSession } = useAuth();
  const router = useRouter();
  const search = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [method, setMethod] = useState<"password" | "code">("password");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      let session: Session;
      if (mode === "register") {
        session = await apiRequest<Session>("/api/users/web-register", { method: "POST", body: jsonBody({ nickname: data.nickname, email: data.email, phone: data.phone, password: data.password }) });
      } else if (method === "code") {
        session = await apiRequest<Session>("/api/web-session/redeem", { method: "POST", body: jsonBody({ code: String(data.code || "").trim() }) });
      } else {
        session = await apiRequest<Session>("/api/users/web-login", { method: "POST", body: jsonBody({ account: data.account, password: data.password }) });
      }
      saveSession(session.token, session.user);
      router.replace(search.get("next") || "/today");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "请求失败，请稍后重试。 ");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="zy-auth-layout">
      <section className="zy-auth-intro">
        
        <h1>{mode === "login" ? "继续推进你的下一份申请。" : "建立一套真正可执行的求职工作流。"}</h1>
        <p>在电脑端整理岗位、简历与申请材料；状态和记录会与同一账号的小程序保持一致。</p>
        <ul><li><ShieldCheck size={16} />正式写入前由你确认</li><li><LockKeyhole size={16} />按账号隔离个人数据</li><li><Smartphone size={16} />电脑端与小程序共用记录</li></ul>
      </section>
      <section className="zy-auth-panel">
        <div className="zy-auth-panel-head"><span className="zy-icon-box"><KeyRound size={21} /></span><div><h2>{mode === "login" ? "登录职引" : "创建账号"}</h2><p>{mode === "login" ? "回到你的求职工作台" : "先填写最少信息，后续再完善画像"}</p></div></div>
        {mode === "login" && <div className="zy-auth-tabs" role="tablist"><button type="button" className={method === "password" ? "active" : ""} onClick={() => setMethod("password")}>账号密码</button><button type="button" className={method === "code" ? "active" : ""} onClick={() => setMethod("code")}>小程序登录码</button></div>}
        <form onSubmit={submit} className="zy-form">
          {mode === "register" ? <>
            <label>昵称<input name="nickname" maxLength={60} autoComplete="name" placeholder="你的称呼" /></label>
            <label>邮箱<input name="email" type="email" autoComplete="email" placeholder="name@example.com" /></label>
            <label>手机号（选填）<input name="phone" inputMode="tel" autoComplete="tel" placeholder="用于登录的手机号" /></label>
            <label>密码<input name="password" type="password" required minLength={6} autoComplete="new-password" placeholder="至少 6 位" /></label>
          </> : method === "password" ? <>
            <label>邮箱或手机号<input name="account" required autoComplete="username" placeholder="请输入账号" /></label>
            <label>密码<input name="password" type="password" required minLength={6} autoComplete="current-password" placeholder="请输入密码" /></label>
          </> : <>
            <label>32 位一次性登录码<input name="code" required minLength={32} maxLength={32} autoComplete="off" placeholder="从小程序复制登录码" /></label>
            <p className="zy-form-hint">在小程序进入「我的 → 设置 → 登录电脑工作台」生成。登录码 5 分钟内有效，使用一次后失效。</p>
          </>}
          {message && <p className="zy-alert" role="alert">{message}</p>}
          <button className="zy-button zy-button-primary zy-submit" type="submit" disabled={busy}>{busy ? "正在提交…" : mode === "login" ? "登录工作台" : "创建账号"}<ArrowRight size={16} /></button>
        </form>
        <p className="zy-auth-switch">{mode === "login" ? <>还没有账号？<Link href="/register">免费注册</Link></> : <>已有账号？<Link href="/login">直接登录</Link></>}</p>
      </section>
    </div>
  );
}
