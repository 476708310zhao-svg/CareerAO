import type { Metadata } from "next";
import { InterviewExperiencesHub } from "@/components/resource-pages";
export const metadata: Metadata = { title: "大厂面经库", description: "查看大厂面试经验与备考重点。", alternates: { canonical: "/interview-prep" } };
export default function Page(){return <InterviewExperiencesHub/>}
