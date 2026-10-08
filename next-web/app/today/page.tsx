import type { Metadata } from "next";
import { AuthGate } from "@/components/auth-provider";
import { TodayLive } from "@/components/today-live";

export const metadata: Metadata={title:"今日求职工作台",robots:{index:false,follow:false}};
export default function TodayPage(){return <main className="zy-page"><div className="shell"><AuthGate title="登录后查看今日工作台"><TodayLive/></AuthGate></div></main>}
