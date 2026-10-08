import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "创建职引账号", robots: { index: false, follow: false } };
export default function RegisterPage() { return <main className="zy-auth-page"><div className="shell"><Suspense><AuthForm mode="register" /></Suspense></div></main>; }
