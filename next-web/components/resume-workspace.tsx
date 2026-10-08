"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Check, ChevronDown, Clock3, FileDiff, History, Link2, Loader2, Pencil, RotateCcw, Save, ShieldCheck, Sparkles, X } from "lucide-react";
import { applications, type ResumeVersion } from "@/lib/career-data";
import { jobs } from "@/lib/jobs";
import { track } from "@/lib/analytics";
import { useCareerStore } from "./use-career-store";

type Suggestion = { id: string; original: string; suggested: string; reason: string; status: "pending" | "accepted" | "rejected"; safe: boolean };

export function ResumeWorkspace({ resumeId }: { resumeId: string }) {
  const { store, setStore } = useCareerStore();
  const resume = store.resumes.find((item) => item.id === resumeId)!;
  const currentVersion = resume?.versions.find((version) => version.id === resume.currentVersionId) || resume?.versions.at(-1);
  const [draft, setDraft] = useState<string[] | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [generating, setGenerating] = useState(false);
  const [compareId, setCompareId] = useState("");
  const [notice, setNotice] = useState("");
  const content = draft || currentVersion?.content || [];
  const targetJob = jobs.find((job) => job.id === resume?.targetJobId);
  const linkedApplication = applications.find((item) => item.id === resume?.applicationId);
  const pending = suggestions.filter((item) => item.status === "pending").length;
  const unsafe = suggestions.some((item) => item.status === "accepted" && !item.safe);

  const compareVersion = useMemo(() => resume?.versions.find((version) => version.id === compareId), [resume, compareId]);
  if (!resume || !currentVersion) return <div className="not-found"><span>404</span><h1>没有找到这份简历</h1><Link href="/resume" className="button button-primary"><ArrowLeft size={16}/>返回简历中心</Link></div>;

  async function generateSuggestions() {
    if (store.quota.used >= store.quota.limit) { setNotice("本月免费额度已用完，请升级会员或等待额度重置。"); return; }
    setGenerating(true); setNotice("");
    try {
      const response = await fetch("/api/resumes/analyze", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ content, job: targetJob ? { title: targetJob.title, skills: targetJob.skills } : null }) });
      const result = await response.json();
      setSuggestions(result.suggestions);
      setStore((s) => ({ ...s, quota: { ...s.quota, used: s.quota.used + 1 } }));
      track("resume_generate", { resume_id: resume.id, model: result.model, prompt_version: result.promptVersion });
    } catch { setNotice("AI 分析暂时不可用，请稍后重试。"); }
    finally { setGenerating(false); }
  }
  function review(id: string, status: "accepted" | "rejected") { setSuggestions((items) => items.map((item) => item.id === id ? { ...item, status } : item)); track("resume_suggestion_review", { resume_id: resume.id, suggestion_id: id, decision: status }); }
  function editSuggestion(id: string, value: string) { setSuggestions((items) => items.map((item) => item.id === id ? { ...item, suggested: value, safe: hasNoNewNumbers(item.original, value) } : item)); }
  function saveManualVersion() { if (!draft) return; addVersion(draft, "manual", "Manual edits confirmed by user"); setDraft(null); }
  function saveAiVersion() {
    if (pending > 0 || unsafe) return;
    const accepted = suggestions.filter((item) => item.status === "accepted");
    if (!accepted.length) { setNotice("至少接受一条建议后才能保存新版本。"); return; }
    const updated = content.map((line) => accepted.find((item) => item.original === line)?.suggested || line);
    addVersion(updated, "ai", `Accepted ${accepted.length} of ${suggestions.length} AI suggestions`, "zhiyin-resume-1.2", "resume-opt-v3");
    setSuggestions([]); setNotice("新版本已保存，原版本保持不变。");
  }
  function addVersion(nextContent: string[], source: ResumeVersion["source"], note: string, aiModel?: string, promptVersion?: string) {
    setStore((s) => ({ ...s, resumes: s.resumes.map((item) => { if (item.id !== resume.id) return item; const id = `${item.id}-v${item.versions.length + 1}-${Date.now()}`; return { ...item, currentVersionId: id, updatedAt: new Date().toISOString(), optimizationCount: source === "ai" ? item.optimizationCount + 1 : item.optimizationCount, versions: [...item.versions, { id, label: `Version ${item.versions.length + 1}`, createdAt: new Date().toISOString(), source, content: nextContent, note, aiModel, promptVersion }] }; }) }));
  }
  function restoreVersion(version: ResumeVersion) { addVersion([...version.content], "restore", `Restored from ${version.label}`); setCompareId(""); track("resume_version_restore", { resume_id: resume.id, version_id: version.id }); }
  function linkJob(value: string) { setStore((s) => ({ ...s, resumes: s.resumes.map((r) => r.id === resume.id ? { ...r, targetJobId: value || undefined } : r) })); }
  function linkApplication(value: string) { setStore((s) => ({ ...s, resumes: s.resumes.map((r) => r.id === resume.id ? { ...r, applicationId: value || undefined } : r) })); }

  return <div className="editor-page"><div className="shell editor-topbar"><Link href="/resume"><ArrowLeft size={16}/>简历中心</Link><div><span>{resume.kind}</span><h1>{resume.name}</h1></div><div className="editor-status"><ShieldCheck size={15}/><span>自动保存已开启</span></div></div>
    <div className="shell editor-layout"><aside className="editor-rail"><div className="rail-score"><span>ATS Readiness</span><strong>{resume.atsScore}<small>/100</small></strong><i><em style={{ width: `${resume.atsScore}%` }}/></i></div><div className="rail-block"><h3><Link2 size={15}/>关联信息</h3><label>目标岗位<div className="rail-select"><select value={resume.targetJobId || ""} onChange={(e) => linkJob(e.target.value)}><option value="">未关联</option>{jobs.map((job) => <option value={job.id} key={job.id}>{job.company} · {job.title}</option>)}</select><ChevronDown size={13}/></div></label><label>申请记录<div className="rail-select"><select value={resume.applicationId || ""} onChange={(e) => linkApplication(e.target.value)}><option value="">未关联</option>{applications.map((app) => <option value={app.id} key={app.id}>{app.company} · {app.status}</option>)}</select><ChevronDown size={13}/></div></label></div><div className="rail-block"><h3><History size={15}/>版本历史</h3>{[...resume.versions].reverse().map((version) => <button className={version.id === resume.currentVersionId ? "version-item active" : "version-item"} key={version.id} onClick={() => setCompareId(version.id)}><span>{version.label}<small>{new Date(version.createdAt).toLocaleDateString("zh-CN")} · {version.source}</small></span>{version.id === resume.currentVersionId && <Check size={13}/>}</button>)}</div><div className="quota-mini"><Sparkles size={15}/><span><b>{store.quota.limit - store.quota.used} 次 AI 额度</b><small>{store.quota.plan} Plan · {store.quota.resetAt} 重置</small></span></div></aside>
      <main className="document-panel"><div className="document-toolbar"><div><span className="resume-file-label">RESUME DOCUMENT</span><p>{currentVersion.label} · {currentVersion.note}</p></div><div>{draft ? <><button onClick={() => setDraft(null)}>取消编辑</button><button className="save-action" onClick={saveManualVersion}><Save size={15}/>确认并保存新版本</button></> : <button onClick={() => setDraft([...content])}><Pencil size={15}/>手动编辑</button>}</div></div><div className="resume-paper"><div className="paper-name">Alex Chen</div><div className="paper-contact">alex.chen@email.com · Pittsburgh, PA · linkedin.com/in/alexchen</div><div className="paper-section"><h2>EXPERIENCE & PROJECTS</h2>{content.map((line, index) => <div className="paper-bullet" key={`${index}-${line.slice(0, 12)}`}>{draft ? <textarea value={line} onChange={(e) => setDraft((items) => items!.map((item, i) => i === index ? e.target.value : item))}/> : <><span>•</span><p>{line}</p></>}</div>)}</div></div></main>
      <aside className="ai-review"><div className="ai-review-head"><div><Sparkles size={17}/><span><b>AI Resume Engineer</b><small>只提出建议，不会覆盖原文</small></span></div><span className="safety-chip"><ShieldCheck size={12}/>事实保护</span></div>{notice && <div className="review-notice">{notice}</div>}{suggestions.length === 0 ? <div className="review-empty"><Sparkles size={27}/><h3>开始岗位定制分析</h3><p>{targetJob ? `将根据 ${targetJob.company} · ${targetJob.title} 分析当前简历。` : "先关联目标岗位，或直接进行通用 ATS 分析。"}</p><button onClick={generateSuggestions} disabled={generating}>{generating ? <Loader2 className="spin" size={16}/> : <Sparkles size={16}/>}生成 AI 建议</button><small>消耗 1 次额度 · 不会修改原简历</small></div> : <><div className="review-summary"><span>{pending ? `${pending} 条待确认` : "审核已完成"}</span><button onClick={() => setSuggestions([])}>清空</button></div><div className="suggestion-list">{suggestions.map((item, index) => <article className={`suggestion-card ${item.status}`} key={item.id}><header><span>建议 {index + 1}</span><b>{item.status === "pending" ? "待确认" : item.status === "accepted" ? "已接受" : "已拒绝"}</b></header><label>原内容<p>{item.original}</p></label><label>AI 建议<textarea value={item.suggested} onChange={(e) => editSuggestion(item.id, e.target.value)}/></label><div className="reason"><Sparkles size={13}/><span><b>修改原因</b>{item.reason}</span></div>{!item.safe && <div className="unsafe-warning"><AlertTriangle size={13}/>检测到原文没有的新数字，请核实或删除后再保存。</div>}<footer><button onClick={() => review(item.id, "rejected")}><X size={14}/>拒绝</button><button onClick={() => review(item.id, "accepted")}><Check size={14}/>接受</button></footer></article>)}</div><button className="save-ai-version" disabled={pending > 0 || unsafe} onClick={saveAiVersion}><Save size={15}/>确认并保存为新版本</button><small className="immutable-note">原版本将永久保留，可随时恢复</small></>}</aside>
    </div>{compareVersion && <div className="compare-drawer"><div className="compare-head"><div><FileDiff size={18}/><span><b>版本对比：{compareVersion.label}</b><small>{compareVersion.note}</small></span></div><button onClick={() => setCompareId("")}><X size={17}/></button></div><div className="compare-columns"><div><h3>当前版本</h3>{content.map((line) => <p key={line}>{line}</p>)}</div><div><h3>{compareVersion.label}</h3>{compareVersion.content.map((line) => <p key={line}>{line}</p>)}</div></div>{compareVersion.id !== resume.currentVersionId && <button className="button button-primary" onClick={() => restoreVersion(compareVersion)}><RotateCcw size={15}/>恢复为新版本</button>}<div className="version-audit"><Clock3 size={13}/>{compareVersion.aiModel ? `AI: ${compareVersion.aiModel} · Prompt: ${compareVersion.promptVersion}` : "用户手动创建"}</div></div>}</div>;
}

function hasNoNewNumbers(original: string, proposed: string) {
  const source = new Set(original.match(/\d+(?:\.\d+)?%?/g) || []);
  return (proposed.match(/\d+(?:\.\d+)?%?/g) || []).every((number) => source.has(number));
}
