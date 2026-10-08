import type { Metadata } from "next";
import { JobDetailLive } from "@/components/job-detail-live";

type Props = { params: Promise<{ id: string }> };
export const metadata: Metadata = { title: "职位详情", description: "查看职位信息、来源与申请入口。" };
export default async function JobDetailPage({ params }: Props) { return <JobDetailLive id={(await params).id} />; }
