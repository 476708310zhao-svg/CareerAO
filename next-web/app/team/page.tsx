import type { Metadata } from "next";
import { TeamHub } from "@/components/resource-pages";
export const metadata: Metadata = { title: "团队介绍", description: "了解职引的产品使命与服务原则。", alternates: { canonical: "/team" } };
export default function Page(){return <TeamHub/>}
