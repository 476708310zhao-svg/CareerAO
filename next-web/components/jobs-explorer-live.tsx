"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, BriefcaseBusiness, CalendarDays, ExternalLink, Filter, Loader2, MapPin, Search, ShieldCheck } from "lucide-react";
import { ApiError, apiRequest, jsonBody, localApiRequest } from "@/lib/api-client";
import { useAuth } from "./auth-provider";

type Job = { id: string; title: string; company: string; location?: string; region?: string; salary?: string; jobType?: string; industry?: string; description?: string; requirements?: string[]; tags?: string[]; postedAt?: string; applyUrl?: string; sourceLabel?: string; dataMeta?: { freshnessLabel?: string; sourceLabel?: string; degraded?: boolean } };
type JobsResult = { list: Job[]; total: number; page: number; totalPages: number; source: string; dataMeta?: { freshnessLabel?: string; sourceLabel?: string; degraded?: boolean } };

export function JobsExplorerLive() {
  const { token } = useAuth();
  const [data, setData] = useState<JobsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [adding, setAdding] = useState<string | null>(null);
  const requestRef = useRef<AbortController | null>(null);

  async function search(params = new URLSearchParams()) {
    requestRef.current?.abort(); const controller = new AbortController(); requestRef.current = controller;
    setLoading(true); setRefreshing(false); setError(""); setMessage("");

    let hasLocalData = false;
    const localParams = new URLSearchParams(params);
    localParams.set("source", "local");
    try {
      const localData = await apiRequest<JobsResult>(`/api/jobs?${localParams.toString()}`, { signal: controller.signal });
      if (controller.signal.aborted) return;
      setData(localData);
      hasLocalData = true;
      setLoading(false);
    } catch {
      if (controller.signal.aborted) return;
      try {
        const fallbackData = await localApiRequest<JobsResult>(`/api/jobs?${localParams.toString()}`, { signal: controller.signal });
        if (controller.signal.aborted) return;
        setData(fallbackData);
        hasLocalData = true;
        setMessage("真实职位服务暂未开放，当前展示演示数据。");
        setLoading(false);
      } catch (fallbackError) {
        if (!controller.signal.aborted) setError(fallbackError instanceof Error ? fallbackError.message : "职位加载失败");
      }
    }

    const liveController = new AbortController();
    const abortLive = () => liveController.abort();
    controller.signal.addEventListener("abort", abortLive, { once: true });
    const timeout = window.setTimeout(() => liveController.abort(), 9000);
    setRefreshing(true);
    try {
      const liveData = await apiRequest<JobsResult>(`/api/jobs?${params.toString()}`, { signal: liveController.signal });
      if (!controller.signal.aborted) {
        setData(liveData);
        setError("");
      }
    } catch (err) {
      if (!controller.signal.aborted && !hasLocalData) setError(err instanceof Error ? err.message : "职位加载失败");
      if (!controller.signal.aborted && hasLocalData) setMessage("真实职位服务暂未开放，当前展示演示数据。");
    } finally {
      window.clearTimeout(timeout);
      controller.signal.removeEventListener("abort", abortLive);
      if (!controller.signal.aborted) { setLoading(false); setRefreshing(false); }
    }
  }
  useEffect(() => { search(new URLSearchParams({ pageSize: "20" })); return () => requestRef.current?.abort(); }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const params = new URLSearchParams({ pageSize: "20" });
    for (const [key, value] of form.entries()) if (String(value).trim()) params.set(key, String(value).trim());
    search(params);
  }

  async function add(job: Job) {
    if (!token) { window.location.href = `/login?next=${encodeURIComponent("/jobs")}`; return; }
    if (adding) return; setAdding(job.id); setMessage("");
    try {
      const app = await apiRequest<{ id: number }>("/api/v4/applications", { method: "POST", body: jsonBody({ jobId: String(job.id), status: "interested", jobSnapshot: job }) });
      window.location.href = `/applications?open=${app.id}`;
    } catch (err) {
      if (err instanceof ApiError && err.status === 409 && typeof err.data === "object" && err.data && "applicationId" in err.data) window.location.href = `/applications?open=${(err.data as {applicationId:number}).applicationId}`;
      else setMessage(err instanceof Error ? err.message : "加入申请失败");
    } finally { setAdding(null); }
  }

  return <div className="zy-jobs-page"><section className="zy-jobs-hero"><div className="shell"><h1>找到值得投入时间的机会。</h1><p>面向所有大学生与应届毕业生；需要海外求职时，可继续按地区、岗位类型与签证相关信息筛选。</p><form onSubmit={submit} className="zy-job-search"><div><Search size={19} /><input name="keyword" placeholder="搜索岗位、公司或关键词" aria-label="搜索职位" /></div><select name="jobType" aria-label="工作类型"><option value="">全部类型</option><option value="全职">全职</option><option value="实习">实习</option><option value="兼职">兼职</option></select><select name="region" aria-label="地区"><option value="">全部地区</option><option>中国</option><option>美国</option><option>英国</option><option>新加坡</option><option>加拿大</option><option>香港</option></select><button type="submit"><Filter size={16} />筛选职位</button></form></div></section><main className="shell zy-jobs-main"><div className="zy-jobs-summary"><div><h2>{data ? `${data.total} 个可浏览职位` : "职位列表"}</h2><p>{data?.dataMeta?.sourceLabel || (data?.source === "local_fallback" ? "当前展示已核对的历史职位库" : "职位信息持续更新")}</p></div><span>{refreshing ? <><Loader2 className="spin" size={14} />实时职位更新中</> : <><ShieldCheck size={14} />申请前请以企业官网信息为准</>}</span></div>{message && <p className="zy-alert" role="status">{message}</p>}{error && <div className="zy-state-card"><p className="zy-alert">{error}</p><button className="zy-button zy-button-secondary" onClick={() => search(new URLSearchParams({ pageSize: "20" }))}>重新加载</button></div>}{loading ? <div className="zy-state-card"><Loader2 className="spin" size={20} />正在读取职位数据…</div> : <div className="zy-job-list">{data?.list.map((job) => <article key={job.id}><div className="zy-job-logo">{(job.company || "职").slice(0,1)}</div><div className="zy-job-copy"><div><span>{job.jobType || "岗位"}</span>{job.industry && <span>{job.industry}</span>}{job.dataMeta?.freshnessLabel && <span>{job.dataMeta.freshnessLabel}</span>}</div><h2>{job.title}</h2><p>{job.company}</p><ul>{job.location && <li><MapPin size={13} />{job.location}</li>}{job.postedAt && <li><CalendarDays size={13} />{job.postedAt}</li>}{job.sourceLabel && <li><ShieldCheck size={13} />{job.sourceLabel}</li>}</ul>{job.requirements?.length ? <div className="zy-job-tags">{job.requirements.slice(0,4).map((item) => <span key={item}>{item}</span>)}</div> : null}</div><div className="zy-job-actions"><button className="zy-button zy-button-primary" type="button" onClick={() => add(job)} disabled={adding === job.id}>{adding === job.id ? "正在加入…" : "加入申请"}<ArrowRight size={14} /></button><Link className="zy-button zy-button-secondary" href={`/jobs/${encodeURIComponent(job.id)}`}>查看详情</Link>{job.applyUrl && <a href={job.applyUrl} target="_blank" rel="noreferrer">企业官网 <ExternalLink size={12} /></a>}</div></article>)}{!data?.list.length && <div className="zy-empty"><BriefcaseBusiness size={28} /><h2>没有找到匹配职位</h2><p>试试减少筛选条件或更换关键词。</p></div>}</div>}</main></div>;
}
