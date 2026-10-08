import type { Metadata } from "next";
import { InterviewExperiencesHub } from "@/components/resource-pages";
export const metadata: Metadata = { title: "笔经面经", description: "按公司、岗位和轮次查看真实面试复盘。", alternates: { canonical: "/interview-experiences" } };
export default function Page(){return <InterviewExperiencesHub/>}
