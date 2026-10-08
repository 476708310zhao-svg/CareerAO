import type { Metadata } from "next";
import { CampusCalendarHub } from "@/components/public-data-hubs";
export const metadata: Metadata = { title: "校招日历", description: "追踪校招、实习与校园项目的开放和截止时间。", alternates: { canonical: "/campus-calendar" } };
export default function CampusCalendarPage() { return <CampusCalendarHub />; }
