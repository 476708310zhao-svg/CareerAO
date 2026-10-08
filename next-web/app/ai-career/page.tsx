import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthGate } from "@/components/auth-provider";
import { AIExpertLive } from "@/components/ai-expert-live";

export const metadata: Metadata = { title: "AI 求职专家", robots: { index: false, follow: false } };
export default function AICareerPage(){return <main className="zy-page"><div className="shell"><AuthGate title="登录后使用 AI 求职专家"><Suspense><AIExpertLive/></Suspense></AuthGate></div></main>;}
