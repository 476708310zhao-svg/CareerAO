import type { Metadata } from "next";
import { AgencyEvaluationHub } from "@/components/public-data-hubs";
export const metadata: Metadata = { title: "求职机构测评", description: "对比求职服务机构的服务、公开价格与用户评价。", alternates: { canonical: "/agency-evaluation" } };
export default function AgencyEvaluationPage() { return <AgencyEvaluationHub />; }
