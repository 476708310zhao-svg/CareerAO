import type { Metadata } from "next";
import { VisaPoliciesHub } from "@/components/public-data-hubs";
export const metadata: Metadata = { title: "签证政策", description: "查看大学生与留学生求职相关的工作和毕业生签证信息。", alternates: { canonical: "/visa-policies" } };
export default function VisaPoliciesPage() { return <VisaPoliciesHub />; }
