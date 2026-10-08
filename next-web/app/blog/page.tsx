import type { Metadata } from "next";
import { BlogHub } from "@/components/resource-pages";
export const metadata: Metadata = { title: "求职攻略", description: "查看简历、投递、面试与身份相关的求职方法。", alternates: { canonical: "/blog" } };
export default function Page(){return <BlogHub/>}
