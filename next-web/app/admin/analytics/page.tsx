import type { Metadata } from "next";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
export const metadata: Metadata = { title: "运营数据看板", robots: { index: false, follow: false } };
export default function AdminAnalyticsPage() { return <AnalyticsDashboard/>; }
