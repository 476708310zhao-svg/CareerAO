import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthGate } from "@/components/auth-provider";
import { ApplicationMaterialsLive } from "@/components/application-materials-live";

export const metadata: Metadata = { title: "AI 申请助手", description: "按目标岗位生成定制简历、Cover Letter、Recruiter 消息与 Follow-up 邮件。", alternates: { canonical: "/application-assistant" } };
export default function ApplicationAssistantPage() { return <main className="zy-page"><div className="shell"><AuthGate title="登录后准备申请材料"><Suspense><ApplicationMaterialsLive /></Suspense></AuthGate></div></main>; }
