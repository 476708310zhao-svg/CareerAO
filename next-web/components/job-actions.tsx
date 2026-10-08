"use client";

import { useState } from "react";
import { Bookmark, BriefcaseBusiness, ExternalLink, MessageSquareText, Sparkles } from "lucide-react";
import { track } from "@/lib/analytics";

export function JobActions({ jobId, officialUrl }: { jobId: string; officialUrl: string }) {
  const [saved, setSaved] = useState(false);
  return <section className="job-actions">
    <button className="button button-primary" onClick={() => { track("application_create", { job_id: jobId }); track("official_apply_click", { job_id: jobId }); window.open(officialUrl, "_blank", "noopener,noreferrer"); }}><ExternalLink size={17}/>前往官方申请</button>
    <button onClick={() => { setSaved(!saved); track("job_save", { job_id: jobId }); }}><Bookmark size={17} fill={saved ? "currentColor" : "none"}/>{saved ? "已收藏" : "收藏职位"}</button>
    <button onClick={() => { track("ai_analysis", { job_id: jobId }); track("job_match_view", { job_id: jobId }); }}><Sparkles size={17}/>AI 深度分析</button>
    <button onClick={() => track("application_create", { job_id: jobId, source: "create_application" })}><BriefcaseBusiness size={17}/>创建申请记录</button>
    <button onClick={() => track("interview_start", { job_id: jobId })}><MessageSquareText size={17}/>准备面试</button>
  </section>;
}
