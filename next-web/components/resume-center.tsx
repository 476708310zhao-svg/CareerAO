"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Archive, ArrowRight, Award, BookOpen, BriefcaseBusiness, Check, Copy, FileText, FolderArchive, GraduationCap, MoreHorizontal, Plus, Search, Sparkles, Star, Target, Wrench } from "lucide-react";
import { applications, resumeKinds, type ExperienceCategory, type ResumeKind } from "@/lib/career-data";
import { jobs } from "@/lib/jobs";
import { useCareerStore } from "./use-career-store";

const categoryMeta: Record<ExperienceCategory, { icon: typeof GraduationCap; label: string }> = {
  Education: { icon: GraduationCap, label: "教育经历" }, Experience: { icon: BriefcaseBusiness, label: "工作经历" }, Projects: { icon: Wrench, label: "项目经历" }, Skills: { icon: Sparkles, label: "技能" }, Awards: { icon: Award, label: "奖项" },
};

export function ResumeCenter() {
  const { store, setStore } = useCareerStore();
  const [tab, setTab] = useState<"resumes" | "profile">("resumes");
  const [showArchived, setShowArchived] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newKind, setNewKind] = useState<ResumeKind>("General Resume");
  const resumes = useMemo(() => store.resumes.filter((resume) => showArchived ? resume.status === "archived" : resume.status === "active"), [store.resumes, showArchived]);

  function createResume() {
    if (!newName.trim()) return;
    const id = `resume-${Date.now()}`;
    const content = store.experiences.flatMap((item) => item.bullets);
    setStore((current) => ({ ...current, resumes: [{ id, name: newName, kind: newKind, status: "active", isDefault: current.resumes.every((r) => !r.isDefault), updatedAt: new Date().toISOString(), atsScore: 70, optimizationCount: 0, currentVersionId: `${id}-v1`, versions: [{ id: `${id}-v1`, label: "Version 1", createdAt: new Date().toISOString(), source: "manual", content, note: "Created from Career Profile" }] }, ...current.resumes] }));
    setCreateOpen(false); setNewName("");
  }
  function copyResume(id: string) { setStore((current) => { const source = current.resumes.find((r) => r.id === id)!; const copyId = `resume-${Date.now()}`; return { ...current, resumes: [{ ...source, id: copyId, name: `${source.name} Copy`, isDefault: false, updatedAt: new Date().toISOString(), versions: source.versions.map((v, i) => ({ ...v, id: `${copyId}-v${i + 1}` })), currentVersionId: `${copyId}-v${source.versions.length}` }, ...current.resumes] }; }); }
  function renameResume(id: string) { const current = store.resumes.find((r) => r.id === id); const name = window.prompt("输入新的简历名称", current?.name); if (name?.trim()) setStore((s) => ({ ...s, resumes: s.resumes.map((r) => r.id === id ? { ...r, name: name.trim(), updatedAt: new Date().toISOString() } : r) })); }
  function toggleArchive(id: string) { setStore((s) => ({ ...s, resumes: s.resumes.map((r) => r.id === id ? { ...r, status: r.status === "active" ? "archived" : "active", isDefault: r.status === "active" ? false : r.isDefault } : r) })); }
  function makeDefault(id: string) { setStore((s) => ({ ...s, resumes: s.resumes.map((r) => ({ ...r, isDefault: r.id === id })) })); }

  return <div className="workspace-page">
    <section className="workspace-hero"><div className="shell workspace-hero-inner"><div><span className="section-label">AI RESUME CENTER</span><h1>让每份简历都有明确目标</h1><p>用一套真实经历，管理面向不同岗位的简历与版本。</p></div><div className="workspace-stats"><div><b>{store.resumes.filter((r) => r.status === "active").length}</b><span>活跃简历</span></div><div><b>{store.resumes.reduce((n, r) => n + r.versions.length, 0)}</b><span>历史版本</span></div><div><b>{store.quota.limit - store.quota.used}</b><span>本月 AI 额度</span></div></div></div></section>
    <div className="shell workspace-body"><div className="workspace-tabs"><button className={tab === "resumes" ? "active" : ""} onClick={() => setTab("resumes")}><FileText size={16}/>简历库</button><button className={tab === "profile" ? "active" : ""} onClick={() => setTab("profile")}><BookOpen size={16}/>基础经历库</button><Link href="/application-assistant"><Sparkles size={16}/>AI 申请助手</Link></div>
      {tab === "resumes" ? <>
        <div className="library-toolbar"><div><h2>{showArchived ? "已归档简历" : "我的简历"}</h2><p>一份基础经历，组合出多份目标简历。</p></div><div><button className="text-button" onClick={() => setShowArchived(!showArchived)}><FolderArchive size={16}/>{showArchived ? "查看活跃简历" : "归档"}</button><button className="button button-primary" onClick={() => setCreateOpen(true)}><Plus size={16}/>新建简历</button></div></div>
        <div className="resume-grid">{resumes.map((resume) => { const job = jobs.find((j) => j.id === resume.targetJobId); const application = applications.find((a) => a.id === resume.applicationId); return <article className="resume-tile" key={resume.id}><div className="resume-tile-head"><div className="resume-file-icon"><FileText size={21}/></div><div className="resume-actions"><button title="复制" onClick={() => copyResume(resume.id)}><Copy size={15}/></button><button title="重命名" onClick={() => renameResume(resume.id)}><MoreHorizontal size={17}/></button></div></div><div className="resume-kind">{resume.kind}</div><h3>{resume.name}</h3><div className="resume-badges">{resume.isDefault && <span className="default-badge"><Star size={11} fill="currentColor"/>默认简历</span>}<span>{resume.versions.length} 个版本</span></div><div className="ats-row"><span>ATS Readiness</span><b>{resume.atsScore}%</b><i><em style={{ width: `${resume.atsScore}%` }}/></i></div><div className="resume-links"><div><Target size={14}/><span><small>目标岗位</small><b>{job ? `${job.company} · ${job.title}` : "未关联"}</b></span></div><div><BriefcaseBusiness size={14}/><span><small>申请记录</small><b>{application ? `${application.company} · ${application.status}` : "未关联"}</b></span></div></div><footer><span>更新于 {new Date(resume.updatedAt).toLocaleDateString("zh-CN")} · AI 优化 {resume.optimizationCount} 次</span><Link href={`/resume/${resume.id}`}>打开编辑器 <ArrowRight size={14}/></Link></footer><div className="tile-secondary-actions">{!resume.isDefault && resume.status === "active" && <button onClick={() => makeDefault(resume.id)}><Star size={13}/>设为默认</button>}<button onClick={() => toggleArchive(resume.id)}><Archive size={13}/>{resume.status === "active" ? "归档" : "恢复"}</button></div></article>; })}</div>
        {resumes.length === 0 && <div className="empty-state"><FolderArchive size={28}/><h3>这里还没有简历</h3><p>{showArchived ? "没有已归档的简历。" : "新建一份简历开始吧。"}</p></div>}
      </> : <ExperienceLibrary store={store} setStore={setStore}/>} 
    </div>
    {createOpen && <div className="modal-backdrop"><div className="modal-card"><div className="modal-icon"><FileText size={21}/></div><h2>新建目标简历</h2><p>将从基础经历库创建初始版本，之后可自由调整。</p><label>简历名称<input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="例如：NVIDIA AI Engineer" autoFocus/></label><label>简历类型<select value={newKind} onChange={(e) => setNewKind(e.target.value as ResumeKind)}>{resumeKinds.map((kind) => <option key={kind}>{kind}</option>)}</select></label><div><button className="button button-ghost" onClick={() => setCreateOpen(false)}>取消</button><button className="button button-primary" onClick={createResume}>创建简历</button></div></div></div>}
  </div>;
}

function ExperienceLibrary({ store, setStore }: { store: ReturnType<typeof useCareerStore>["store"]; setStore: ReturnType<typeof useCareerStore>["setStore"] }) {
  const [category, setCategory] = useState<ExperienceCategory>("Experience");
  const [query, setQuery] = useState("");
  const items = store.experiences.filter((item) => item.category === category && `${item.title} ${item.organization} ${item.bullets.join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  function addItem() { const title = window.prompt("经历名称"); if (!title?.trim()) return; const organization = window.prompt("学校、公司或项目组织") || ""; setStore((s) => ({ ...s, experiences: [...s.experiences, { id: `exp-${Date.now()}`, category, title: title.trim(), organization, bullets: ["点击编辑，补充真实经历描述"] }] })); }
  function editItem(id: string) { const current = store.experiences.find((item) => item.id === id)!; const bullet = window.prompt("编辑经历描述（请只填写真实信息）", current.bullets.join("\n")); if (bullet !== null) setStore((s) => ({ ...s, experiences: s.experiences.map((item) => item.id === id ? { ...item, bullets: bullet.split("\n").filter(Boolean) } : item) })); }
  return <><div className="library-toolbar"><div><h2>基础经历库</h2><p>所有简历只引用这里经过你确认的真实经历。</p></div><button className="button button-primary" onClick={addItem}><Plus size={16}/>添加经历</button></div><div className="experience-layout"><aside>{(Object.keys(categoryMeta) as ExperienceCategory[]).map((key) => { const Icon = categoryMeta[key].icon; return <button className={category === key ? "active" : ""} key={key} onClick={() => setCategory(key)}><Icon size={16}/><span>{categoryMeta[key].label}</span><b>{store.experiences.filter((i) => i.category === key).length}</b></button>; })}</aside><section><div className="experience-search"><Search size={16}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索经历内容"/></div>{items.map((item) => <article className="experience-card" key={item.id}><div><span>{item.period || categoryMeta[item.category].label}</span><h3>{item.title}</h3><p>{item.organization}</p></div><ul>{item.bullets.map((bullet) => <li key={bullet}><Check size={13}/>{bullet}</li>)}</ul><button onClick={() => editItem(item.id)}>编辑</button></article>)}</section></div></>;
}
