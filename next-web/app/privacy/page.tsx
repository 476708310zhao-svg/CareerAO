import type { Metadata } from "next";
import { LegalHub } from "@/components/resource-pages";
export const metadata: Metadata = { title: "隐私政策", description: "了解职引对个人信息的处理和保护方式。", alternates: { canonical: "/privacy" } };
export default function Page(){return <LegalHub type="privacy"/>}
