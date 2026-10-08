import type { Metadata } from "next";
import { SalaryInsightsHub } from "@/components/public-data-hubs";
export const metadata: Metadata = { title: "薪资查询", description: "按岗位、公司、地区和币种查看匿名薪资样本。", alternates: { canonical: "/salary-insights" } };
export default function SalaryInsightsPage() { return <SalaryInsightsHub />; }
