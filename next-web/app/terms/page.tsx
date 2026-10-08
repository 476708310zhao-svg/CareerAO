import type { Metadata } from "next";
import { LegalHub } from "@/components/resource-pages";
export const metadata: Metadata = { title: "服务条款", description: "了解职引平台服务、AI 功能边界和用户规范。", alternates: { canonical: "/terms" } };
export default function Page(){return <LegalHub type="terms"/>}
