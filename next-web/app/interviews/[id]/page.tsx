import type { Metadata } from "next";
import { InterviewWorkspaceView } from "@/components/interview-workspace";
import { notFound } from "next/navigation";
import { featureFlags } from "@/lib/feature-flags";
export const metadata: Metadata = { title: "岗位专属面试空间", robots: { index: false, follow: false } };
export default async function InterviewPage({ params }: { params: Promise<{ id: string }> }) { if (!featureFlags.interviewWorkspace) notFound(); return <InterviewWorkspaceView workspaceId={(await params).id}/>; }
