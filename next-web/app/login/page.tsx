import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "登录工作台", robots: { index: false, follow: false } };
export default function LoginPage() { return <main className="zy-auth-page"><div className="shell"><Suspense><AuthForm mode="login" /></Suspense></div></main>; }
