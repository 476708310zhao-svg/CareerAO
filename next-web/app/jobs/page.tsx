import type { Metadata } from "next";
import { JobsExplorerLive } from "@/components/jobs-explorer-live";

export const metadata: Metadata = { title: "大学生职位中心", description: "浏览适合大学生、应届毕业生与留学生的职位与实习机会。", alternates: { canonical: "/jobs" } };
export default function JobsPage() { return <JobsExplorerLive />; }
