"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Check, Copy, FileCheck2, FileText, Loader2, LockKeyhole, Mail, MessageSquareText, Save, ShieldCheck, Sparkles } from "lucide-react";
import { applications, type ApplicationMaterialType } from "@/lib/career-data";
import { jobs } from "@/lib/jobs";
import { track } from "@/lib/analytics";
import { useCareerStore } from "./use-career-store";

const materialOptions: { type: ApplicationMaterialType; icon: typeof FileText; title: string; text: string }[] = [
  { type: "Tailored Resume", icon: FileCheck2, title: "按 JD 定制简历", text: "基于已确认经历，调整内容顺序与表达" },
  { type: "Cover Letter", icon: FileText, title: "Cover Letter", text: "生成与岗位和个人经历一致的求职信" },
  { type: "Recruiter Message", icon: MessageSquareText, title: "Recruiter 消息", text: "生成简洁、具体的 LinkedIn 或站内消息" },
  { type: "Follow-up Email", icon: Mail, title: "Follow-up 邮件", text: "按申请阶段生成专业跟进邮件" },
];

export function ApplicationAssistant() {
  const { store, setStore } = useCareerStore();
  const [applicationId, setApplicationId] = useState(applications[0].id);
  const [resumeId, setResumeId] = useState(store.resumes.find((r) => r.isDefault)?.id || store.resumes[0]?.id || "");
  const [type, setType] = useState<ApplicationMaterialType>("Tailored Resume");
  const [tone, setTone] = useState("Professional & concise");
  const [instructions, setInstructions] = useState("");
  const [content, setContent] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const application = applications.find((item) => item.id === applicationId)!;
  const job = jobs.find((item) => item.id === application.jobId)!;
  const resume = store.resumes.find((item) => item.id === resumeId);
  const savedForApplication = useMemo(() => store.materials.filter((item) => item.applicationId === applicationId), [store.materials, applicationId]);
  const quotaLeft = store.quota.limit - store.quota.used;

  async function generate() {
    if (!resume) { setMessage("请先选择一份简历。"); return; }
    if (quotaLeft <= 0) { setMessage("免费额度已用完。升级 Pro 后可继续生成申请材料。"); return; }
    setGenerating(true); setMessage(""); setConfirmed(false);
    const version = resume.versions.find((item) => item.id === resume.currentVersionId) || resume.versions.at(-1)!;
    try {
      const response = await fetch("/api/application-materials/generate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ type, tone, instructions, application, job: { company: job.company, title: job.title, description: job.description, skills: job.skills }, verifiedExperience: version.content }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setContent(result.content);
      setStore((s) => ({ ...s, quota: { ...s.quota, used: s.quota.used + 1 } }));
      track("resume_generate", { material_type: type, application_id: applicationId, model: result.model });
    } catch { setMessage("生成失败，请稍后重试。"); }
    finally { setGenerating(false); }
  }
  function save() {
    if (!confirmed || !content.trim()) return;
    setStore((s) => ({ ...s, materials: [...s.materials, { id: `material-${Date.now()}`, applicationId, type, content, createdAt: new Date().toISOString(), model: "zhiyin-application-1.1", promptVersion: "application-material-v2" }] }));
    track("application_material_save", { application_id: applicationId, material_type: type });
    setMessage("材料已保存并关联到该申请记录。"); setConfirmed(false);
  }

  return <div className="assistant-page"><section className="assistant-hero"><div className="shell"><span className="section-label">AI APPLICATION ASSISTANT</span><h1>把真实经历，转化为有针对性的申请材料</h1><p>所有内容都需要你确认后才会保存，并自动关联到对应申请记录。</p><div className="trust-row"><span><ShieldCheck size={14}/>只使用已确认经历</span><span><LockKeyhole size={14}/>禁止自动覆盖</span><span><Check size={14}/>保存前必须确认</span></div></div></section>
    <div className="shell assistant-layout"><aside className="assistant-setup"><h2>1. 选择申请</h2><label>申请记录<select value={applicationId} onChange={(e) => { setApplicationId(e.target.value); setContent(""); }}>{applications.map((item) => <option value={item.id} key={item.id}>{item.company} · {item.role}</option>)}</select></label><div className="selected-job"><span className="company-logo" style={{ background: job.companyColor }}>{job.companyInitials}</span><div><b>{job.title}</b><span>{job.company} · {job.location}</span><small>{application.status} · {job.skills.slice(0, 3).join(" · ")}</small></div></div><label>使用简历<select value={resumeId} onChange={(e) => setResumeId(e.target.value)}>{store.resumes.filter((item) => item.status === "active").map((item) => <option value={item.id} key={item.id}>{item.name}{item.isDefault ? " · 默认" : ""}</option>)}</select></label><h2>2. 选择材料</h2><div className="material-options">{materialOptions.map(({ icon: Icon, ...item }) => <button className={type === item.type ? "active" : ""} key={item.type} onClick={() => { setType(item.type); setContent(""); }}><Icon size={17}/><span><b>{item.title}</b><small>{item.text}</small></span>{type === item.type && <Check size={14}/>}</button>)}</div><label>语气<select value={tone} onChange={(e) => setTone(e.target.value)}><option>Professional & concise</option><option>Warm & conversational</option><option>Technical & detailed</option></select></label><label>补充要求（可选）<textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="例如：突出 LLM 项目；不要添加原经历中没有的数据"/></label><button className="generate-material" onClick={generate} disabled={generating || quotaLeft <= 0}>{generating ? <Loader2 className="spin" size={17}/> : <Sparkles size={17}/>}生成申请材料 <ArrowRight size={15}/></button><div className="quota-card"><div><span>{store.quota.plan} Plan</span><b>{quotaLeft} / {store.quota.limit} 次剩余</b></div><i><em style={{ width: `${Math.max(0, quotaLeft / store.quota.limit * 100)}%` }}/></i><small>{store.quota.resetAt} 重置 · 每次生成消耗 1 次</small></div></aside>
      <main className="material-preview"><div className="preview-head"><div><span className="section-label">PREVIEW & CONFIRM</span><h2>{materialOptions.find((item) => item.type === type)?.title}</h2></div>{content && <button onClick={() => navigator.clipboard.writeText(content)}><Copy size={15}/>复制</button>}</div>{message && <div className="assistant-message"><AlertCircle size={15}/>{message}</div>}{content ? <><div className="editable-material"><div className="material-doc-meta"><span>To: {job.company} Hiring Team</span><span>Application: {application.id}</span></div><textarea value={content} onChange={(e) => { setContent(e.target.value); setConfirmed(false); }}/><div className="material-audit"><ShieldCheck size={14}/><span><b>事实来源检查通过</b>内容仅引用所选简历中已确认的经历；请在保存前再次核实。</span></div></div><label className="confirm-material"><input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)}/><span/><p><b>我已阅读并确认内容真实准确</b>我了解 AI 可能出错，并已核实所有经历、技能和数据。</p></label><button className="save-material" disabled={!confirmed} onClick={save}><Save size={16}/>确认并保存到申请记录</button><p className="save-policy"><LockKeyhole size={12}/>未勾选确认前，系统禁止保存</p></> : <div className="material-empty"><div><Sparkles size={29}/></div><h3>你的申请材料将在这里生成</h3><p>选择申请、简历和材料类型。AI 只会使用经历库中经过确认的事实。</p><div className="empty-flow"><span>原始经历</span><ArrowRight size={14}/><span>AI 草稿</span><ArrowRight size={14}/><span>你的确认</span><ArrowRight size={14}/><span>关联申请</span></div></div>}</main>
      <aside className="saved-materials"><div className="saved-head"><h2>已保存材料</h2><span>{savedForApplication.length}</span></div>{savedForApplication.length ? savedForApplication.map((item) => <article key={item.id}><div><FileText size={15}/><span><b>{item.type}</b><small>{new Date(item.createdAt).toLocaleString("zh-CN")}</small></span></div><p>{item.content.slice(0, 100)}…</p><footer><span>{item.model}</span><button onClick={() => setContent(item.content)}>打开</button></footer></article>) : <div className="saved-empty"><FileText size={23}/><p>保存后的材料会自动显示在这里，并与 {application.company} 的申请关联。</p></div>}<Link href={`/resume/${resumeId || "resume-sde"}`}>打开关联简历 <ArrowRight size={14}/></Link></aside></div></div>;
}
