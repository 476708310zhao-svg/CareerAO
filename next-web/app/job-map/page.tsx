import type { Metadata } from "next";
import { JobMapHub } from "@/components/public-data-hubs";
export const metadata: Metadata = { title: "求职地图", description: "按地区浏览适合大学生与应届毕业生的职位机会。", alternates: { canonical: "/job-map" } };
export default function JobMapPage() { return <JobMapHub />; }
