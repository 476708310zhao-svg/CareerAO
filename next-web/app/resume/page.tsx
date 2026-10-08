import type { Metadata } from "next";
import { AuthGate } from "@/components/auth-provider";
import { ResumeCenterLive } from "@/components/resume-center-live";

export const metadata: Metadata = { title: "简历中心", description: "管理在线简历、历史版本和 PDF 提取草稿。", robots: { index: false, follow: false } };
export default function ResumePage() { return <main className="zy-page"><div className="shell"><AuthGate title="登录后管理简历"><ResumeCenterLive /></AuthGate></div></main>; }
