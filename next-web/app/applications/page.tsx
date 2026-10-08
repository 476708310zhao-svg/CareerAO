import type { Metadata } from "next";
import { AuthGate } from "@/components/auth-provider";
import { ApplicationsWorkbench } from "@/components/applications-workbench-live";
import { Suspense } from "react";

export const metadata: Metadata = { title: "申请管线", robots: { index: false, follow: false } };
export default function ApplicationsPage() { return <main className="zy-page"><div className="shell"><AuthGate title="登录后管理申请"><Suspense><ApplicationsWorkbench /></Suspense></AuthGate></div></main>; }
