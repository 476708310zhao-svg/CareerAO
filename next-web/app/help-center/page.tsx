import type { Metadata } from "next";
import { HelpCenterHub } from "@/components/resource-pages";
export const metadata: Metadata = { title: "帮助中心", description: "查看职引功能说明和常见问题。", alternates: { canonical: "/help-center" } };
export default function Page(){return <HelpCenterHub/>}
