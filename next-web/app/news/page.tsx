import type { Metadata } from "next";
import { NewsHub } from "@/components/public-data-hubs";
export const metadata: Metadata = { title: "求职资讯", description: "阅读近期校招动态、行业变化与求职方法。", alternates: { canonical: "/news" } };
export default function NewsPage() { return <NewsHub />; }
