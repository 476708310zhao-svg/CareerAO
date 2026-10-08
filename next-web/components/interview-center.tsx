"use client";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CalendarClock, CheckCircle2, Clock3, MessageSquareText, Sparkles, Target } from "lucide-react";
import { useSprint4Store } from "./use-sprint4-store";
import { applications } from "@/lib/career-data";
import { jobs } from "@/lib/jobs";

export function InterviewCenter() {
  const { store, setStore } = useSprint4Store();
  useEffect(() => {
    setStore((current) => {
      const missing = applications.filter((app) => app.status === "Interview" && !current.interviews.some((space) => space.applicationId === app.id));
      if (!missing.length) return current;
      return { ...current, interviews: [...current.interviews, ...missing.map((app) => { const job = jobs.find((item) => item.id === app.jobId); return { id: `interview-${app.id}`, applicationId: app.id, company: app.company, role: app.role, interviewAt: new Date(Date.now() + 3 * 86400000).toISOString(), round: "Technical" as const, readiness: 20, createdAutomatically: true, sessions: [], questions: [{ id: `q-${app.id}-1`, type: "Behavioral" as const, question: "请用 STAR 结构介绍一个最相关的项目。", frequency: "High" as const, completed: false }, { id: `q-${app.id}-2`, type: "Role-specific" as const, question: `你会如何解决 ${job?.track || "该岗位"} 中的核心技术问题？`, frequency: "High" as const, completed: false }] }; })] };
    });
  }, []);
  return <div className="interview-center"><section className="interview-hero"><div className="shell"><span className="section-label">INTERVIEW WORKSPACES</span><h1>每场面试，都有一套准备路径</h1><p>申请进入 Interview 后自动创建，集中管理轮次、问题、训练与能力报告。</p></div></section><div className="shell interview-center-body"><div className="interview-summary"><div><CalendarClock size={18}/><span><b>{store.interviews.length}</b><small>进行中的面试</small></span></div><div><CheckCircle2 size={18}/><span><b>{store.interviews.reduce((n, item) => n + item.questions.filter((q) => q.completed).length, 0)}</b><small>已完成题目</small></span></div><div><MessageSquareText size={18}/><span><b>{store.interviews.reduce((n, item) => n + item.sessions.length, 0)}</b><small>历史训练</small></span></div></div><div className="interview-list">{store.interviews.map((space) => <article key={space.id}><div className="interview-card-top"><span className="interview-company">{space.company.slice(0, 2).toUpperCase()}</span><div><span>{space.company}</span><h2>{space.role}</h2><p><CalendarClock size={13}/>{new Date(space.interviewAt).toLocaleString("zh-CN")} · {space.round}</p></div><b>{daysUntil(space.interviewAt)}<small>天后</small></b></div><div className="readiness"><span>准备完成度 <b>{space.readiness}%</b></span><i><em style={{ width: `${space.readiness}%` }}/></i></div><div className="interview-card-stats"><span><Target size={13}/>{space.questions.length} 道专属问题</span><span><Clock3 size={13}/>{space.sessions.length} 次训练记录</span><span><Sparkles size={13}/>{space.createdAutomatically ? "自动创建" : "手动创建"}</span></div><Link href={`/interviews/${space.id}`}>进入面试空间 <ArrowRight size={15}/></Link></article>)}</div></div></div>;
}
function daysUntil(date: string) { return Math.max(0, Math.ceil((+new Date(date) - Date.now()) / 86400000)); }
