import type { Metadata } from "next";
import { MembershipCenter } from "@/components/membership-center";
import { notFound } from "next/navigation";
import { featureFlags } from "@/lib/feature-flags";
export const metadata: Metadata = { title: "会员方案与权益", description: "查看职引会员方案、AI 配额与高级求职权益。" };
export default function PricingPage() { if (!featureFlags.membership) notFound(); return <MembershipCenter/>; }
