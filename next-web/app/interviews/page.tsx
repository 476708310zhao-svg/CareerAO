/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageSquareText, QrCode, ShieldCheck, Smartphone } from "lucide-react";
import { publicAsset } from "@/lib/base-path";

export const metadata:Metadata={title:"面试准备",description:"了解职引面试题库、STAR 练习与 AI 模拟面试。"};
export default function InterviewsPage(){return <main className="zy-page"><div className="shell"><div className="zy-page-head"><div><h1>把面试训练留给更适合练习的场景。</h1><p>面试题库、STAR 练习与 AI 模拟面试目前在职引小程序中使用；Web 端继续负责申请管理、材料长文编辑和 AI 专家问询。</p></div></div><section className="zy-mobile-handoff"><div><span className="zy-icon-box"><Smartphone size={22}/></span><h2>打开职引小程序继续</h2><p>扫码进入小程序，在资源中心选择面试题库、STAR 练习或 AI 模拟面试。关联申请的面试摘要仍会回到 Web 申请工作区。</p><ul><li><MessageSquareText size={15}/>适合随时开口练习与快速复盘</li><li><ShieldCheck size={15}/>使用同一账号时共用申请上下文</li></ul><Link className="zy-button zy-button-secondary" href="/applications">返回申请管线<ArrowRight size={14}/></Link></div><div className="zy-qr-card"><QrCode size={18}/>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={publicAsset("/mini-program-qr.jpg")} alt="职引小程序码" width="180" height="180"/><b>微信扫码使用</b><span>题库、STAR、模拟面试与陪跑</span></div></section></div></main>}
