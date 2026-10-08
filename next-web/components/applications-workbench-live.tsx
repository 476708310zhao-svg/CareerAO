"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, BriefcaseBusiness, CalendarClock, Check, ClipboardList, FileText, Loader2, Plus, RefreshCw, Search, Sparkles, X } from "lucide-react";
import { ApiError, apiRequest, createRequestId, jsonBody } from "@/lib/api-client";

type StatusOption = { value: string; label: string };
type Application = {
  id: number; jobId: string; company: string; jobTitle: string; city: string; salary?: string;
  status: string; statusText: string; deadline?: string; interviewTime?: string; nextAction?: string;
  notes?: string; updatedAt?: string; historyId?: number; allowedTransitions?: StatusOption[];
};
type Board = { groups: Record<string, Application[]>; statistics: Record<string, number>; total: number; statuses: StatusOption[] };
type Task = { id: number; title: string; dueAt?: string; priority?: string; completed: boolean };
type Workspace = { application: Application; tasks: Task[]; contacts: { id: number; name: string; role?: string }[]; materials: { id: number; type: string; status: string; updatedAt?: string }[]; resume?: { name: string; version?: { versionNo?: number } } | null; availability?: Record<string, string> };

const groupMeta = [
  ["preparing", "准备中", "先补齐材料和截止日期"],
  ["applied", "已投递", "安排跟进并记录进展"],
  ["interview", "面试中", "围绕岗位集中准备"],
  ["offer", "Offer", "核对条件和下一步"],
  ["closed", "已结束", "保留结果用于复盘"],
] as const;

export function ApplicationsWorkbench() {
  const searchParams = useSearchParams();
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [manualOpen, setManualOpen] = useState(false);
  const [detail, setDetail] = useState<Workspace | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const manualJobId = useRef(`manual_${createRequestId()}`);
  const detailRequest = useRef<AbortController | null>(null);

  const load = useCallback(async (keyword = query) => {
    setLoading(true); setError("");
    try { setBoard(await apiRequest<Board>(`/api/v4/applications/board?keyword=${encodeURIComponent(keyword.trim())}`)); }
    catch (err) { setError(err instanceof Error ? err.message : "申请管线加载失败"); }
    finally { setLoading(false); }
  }, [query]);

  useEffect(() => { load(""); }, [load]);
  useEffect(() => { const id = Number(searchParams.get("open")); if (id) openDetail(id); }, [searchParams]);
  useEffect(() => () => detailRequest.current?.abort(), []);

  async function openDetail(id: number) {
    detailRequest.current?.abort();
    const controller = new AbortController(); detailRequest.current = controller;
    setDetail(null); setDetailLoading(true); setMessage("");
    try { setDetail(await apiRequest<Workspace>(`/api/v4/applications/${id}/workspace`, { signal: controller.signal })); }
    catch (err) { if (!controller.signal.aborted) setMessage(err instanceof Error ? err.message : "申请详情加载失败"); }
    finally { if (!controller.signal.aborted) setDetailLoading(false); }
  }

  async function addManual(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    setBusy(true); setMessage("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const created = await apiRequest<Application>("/api/v4/applications", { method: "POST", body: jsonBody({ jobId: manualJobId.current, sourceType: "manual", status: "preparing", deadline: data.deadline, jobSnapshot: { company: data.company, title: data.title, location: data.location, description: data.jd, applyUrl: data.url } }) });
      form.reset(); manualJobId.current = `manual_${createRequestId()}`; setManualOpen(false); await load(""); await openDetail(created.id);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409 && typeof err.data === "object" && err.data && "applicationId" in err.data) {
        setManualOpen(false); await openDetail(Number((err.data as { applicationId: number }).applicationId)); setMessage("该岗位已在申请管线中，已打开原记录。");
      } else setMessage(err instanceof Error ? err.message : "新增申请失败");
    } finally { setBusy(false); }
  }

  async function updateApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!detail || busy) return;
    setBusy(true); setMessage("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await apiRequest(`/api/v4/applications/${detail.application.id}`, { method: "PATCH", body: jsonBody({ deadline: data.deadline, interviewTime: data.interviewTime, nextAction: data.nextAction, notes: data.notes }) });
      await openDetail(detail.application.id); await load(); setMessage("申请详情已保存。");
    } catch (err) { setMessage(err instanceof Error ? err.message : "保存失败"); }
    finally { setBusy(false); }
  }

  async function updateStatus(status: string) {
    if (!detail || busy || status === detail.application.status) return;
    setBusy(true); setMessage("");
    try {
      await apiRequest(`/api/v4/applications/${detail.application.id}/status`, { method: "PATCH", body: jsonBody({ status, expectedState: { status: detail.application.status, historyId: detail.application.historyId } }) });
      await openDetail(detail.application.id); await load();
    } catch (err) { setMessage(err instanceof Error ? err.message : "状态更新失败"); }
    finally { setBusy(false); }
  }

  async function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!detail || busy) return;
    setBusy(true); const form = event.currentTarget; const data = Object.fromEntries(new FormData(form));
    try { await apiRequest(`/api/v4/applications/${detail.application.id}/tasks`, { method: "POST", body: jsonBody({ title: data.title, dueAt: data.dueAt, priority: data.priority }) }); form.reset(); await openDetail(detail.application.id); }
    catch (err) { setMessage(err instanceof Error ? err.message : "任务添加失败"); }
    finally { setBusy(false); }
  }

  async function toggleTask(task: Task) {
    if (!detail || busy) return;
    setBusy(true);
    try { await apiRequest(`/api/v4/applications/${detail.application.id}/tasks/${task.id}`, { method: "PATCH", body: jsonBody({ completed: !task.completed }) }); await openDetail(detail.application.id); }
    catch (err) { setMessage(err instanceof Error ? err.message : "任务更新失败"); }
    finally { setBusy(false); }
  }

  return (
    <div className="zy-app-workbench">
      <div className="zy-page-head"><div><h1>每一份申请，都有清楚的下一步。</h1><p>从准备材料到面试与结果，申请记录直接读取真实后端，并与小程序使用同一份数据。</p></div><button className="zy-button zy-button-primary" type="button" onClick={() => { setManualOpen(true); setMessage(""); }}><Plus size={16} />新增申请</button></div>
      <div className="zy-toolbar"><form onSubmit={(e) => { e.preventDefault(); load(); }}><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索公司、岗位或地点" aria-label="搜索申请" /><button type="submit">搜索</button></form><button type="button" onClick={() => load()} aria-label="刷新申请管线"><RefreshCw size={17} /></button><span>{board?.total ?? 0} 条申请</span></div>
      {error && <div className="zy-alert" role="alert">{error}</div>}
      {loading ? <div className="zy-state-card" role="status"><Loader2 className="spin" size={20} />正在读取申请管线…</div> : board?.total ? <div className="zy-board">{groupMeta.map(([key,label,hint]) => <section key={key} className="zy-board-column"><header><div><h2>{label}</h2><p>{hint}</p></div><span>{board.groups[key]?.length || 0}</span></header><div>{(board.groups[key] || []).map((app) => <button className="zy-application-card" type="button" key={app.id} onClick={() => openDetail(app.id)}><span className="zy-company-letter">{(app.company || "职").slice(0,1)}</span><div><h3>{app.jobTitle || "待补充岗位"}</h3><p>{app.company || "待补充公司"}{app.city ? ` · ${app.city}` : ""}</p>{app.nextAction && <small><ArrowRight size={12} />{app.nextAction}</small>}</div>{app.deadline && <time><CalendarClock size={12} />{app.deadline}</time>}</button>)}</div></section>)}</div> : <div className="zy-empty"><BriefcaseBusiness size={28} /><h2>还没有申请记录</h2><p>可以从职位页加入真实岗位，也可以手动记录外部申请。</p><div><Link className="zy-button zy-button-secondary" href="/jobs">浏览职位</Link><button className="zy-button zy-button-primary" onClick={() => setManualOpen(true)}>手动新增</button></div></div>}

      {manualOpen && <div className="zy-modal-backdrop" role="presentation"><section className="zy-modal" role="dialog" aria-modal="true" aria-labelledby="manual-title"><header><div><h2 id="manual-title">记录外部申请</h2></div><button type="button" aria-label="关闭新增申请" onClick={() => setManualOpen(false)}><X size={20} /></button></header><form className="zy-form" onSubmit={addManual}><div className="zy-form-row"><label>公司<input name="company" required maxLength={120} /></label><label>岗位<input name="title" required maxLength={160} /></label></div><div className="zy-form-row"><label>地点<input name="location" maxLength={120} /></label><label>截止日期<input name="deadline" type="date" /></label></div><label>官网申请链接<input name="url" type="url" placeholder="https://" maxLength={1000} /></label><label>岗位 JD<textarea name="jd" rows={5} maxLength={12000} /></label>{message && <p className="zy-alert" role="alert">{message}</p>}<button className="zy-button zy-button-primary" disabled={busy}>{busy ? "正在保存…" : "加入准备中"}</button></form></section></div>}

      {(detailLoading || detail || message) && !manualOpen && <aside className="zy-detail-drawer" aria-label="申请详情"><button className="zy-drawer-close" type="button" aria-label="关闭申请详情" onClick={() => { detailRequest.current?.abort(); setDetail(null); setDetailLoading(false); setMessage(""); }}><X size={20} /></button>{detailLoading ? <div className="zy-drawer-loading"><Loader2 className="spin" />正在读取申请工作区…</div> : detail ? <><header><span className="zy-company-letter">{(detail.application.company || "职").slice(0,1)}</span><div><h2>{detail.application.jobTitle}</h2><p>{detail.application.company}{detail.application.city ? ` · ${detail.application.city}` : ""}</p></div></header>{message && <p className={message.includes("已保存") ? "zy-alert zy-success" : "zy-alert"} role="status">{message}</p>}<label className="zy-status-field">当前状态<select value={detail.application.status} onChange={(e) => updateStatus(e.target.value)} disabled={busy}>{(board?.statuses || []).map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select></label><form className="zy-form zy-detail-form" onSubmit={updateApplication}><div className="zy-form-row"><label>截止日期<input type="date" name="deadline" defaultValue={detail.application.deadline?.slice(0,10)} /></label><label>面试时间<input type="datetime-local" name="interviewTime" defaultValue={detail.application.interviewTime?.slice(0,16)} /></label></div><label>下一步行动<input name="nextAction" defaultValue={detail.application.nextAction} maxLength={300} /></label><label>备注<textarea name="notes" defaultValue={detail.application.notes} rows={4} maxLength={2000} /></label><button className="zy-button zy-button-secondary" disabled={busy}>保存申请详情</button></form><section className="zy-package-summary"><h3><FileText size={16} />申请包</h3><div><span>简历版本<b>{detail.resume ? `${detail.resume.name}${detail.resume.version?.versionNo ? ` · V${detail.resume.version.versionNo}` : ""}` : "未关联"}</b></span><span>已确认材料<b>{detail.materials?.filter((item) => item.status === "saved").length || 0} 份</b></span></div><Link href={`/application-assistant?applicationId=${detail.application.id}`}>打开材料工作区 <ArrowRight size={14} /></Link></section><section className="zy-task-section"><h3><ClipboardList size={16} />下一步任务</h3>{detail.tasks?.map((task) => <button type="button" key={task.id} onClick={() => toggleTask(task)} className={task.completed ? "done" : ""}><span>{task.completed && <Check size={13} />}</span><b>{task.title}</b><small>{task.dueAt || "未设置日期"}</small></button>)}<form onSubmit={addTask}><input name="title" required maxLength={200} placeholder="新增任务" aria-label="任务标题" /><input name="dueAt" type="date" aria-label="任务日期" /><select name="priority" aria-label="优先级"><option value="medium">普通</option><option value="high">优先</option><option value="low">稍后</option></select><button disabled={busy} aria-label="添加任务"><Plus size={16} /></button></form></section><div className="zy-drawer-actions"><Link className="zy-button zy-button-primary" href={`/ai-career?applicationId=${detail.application.id}`}><Sparkles size={15} />问 AI 专家</Link><Link className="zy-button zy-button-secondary" href={`/jobs/${detail.application.jobId}`}>查看岗位</Link></div></> : message ? <p className="zy-alert">{message}</p> : null}</aside>}
    </div>
  );
}
