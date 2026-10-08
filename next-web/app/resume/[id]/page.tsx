import type { Metadata } from "next";
import { ResumeWorkspace } from "@/components/resume-workspace";

export const metadata: Metadata = { title: "简历编辑与 AI 优化", description: "逐条审核 AI 简历建议，确认后保存为新版本。" };
export default async function ResumeEditorPage({ params }: { params: Promise<{ id: string }> }) { return <ResumeWorkspace resumeId={(await params).id} />; }
