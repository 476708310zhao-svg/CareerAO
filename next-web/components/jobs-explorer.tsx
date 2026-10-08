"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bookmark, BriefcaseBusiness, ChevronDown, Clock3, MapPin, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import type { Job } from "@/lib/jobs";
import { track } from "@/lib/analytics";

const regions = ["All", "USA", "Canada", "UK", "Singapore"];
const types = ["All", "Intern", "New Grad", "Full Time", "Research", "Co-op"];
const tracks = ["All", "Software Engineer", "AI Engineer", "Machine Learning Engineer", "Data Scientist", "Quant", "Cybersecurity", "Hardware"];
const visaFilters = ["OPT Friendly", "CPT Friendly", "STEM OPT", "H1B Sponsor", "International Student Friendly", "Citizen Required"];

export function JobsExplorer({ jobs }: { jobs: Job[] }) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [type, setType] = useState("All");
  const [trackName, setTrackName] = useState("All");
  const [visa, setVisa] = useState<string[]>([]);
  const [sort, setSort] = useState("match");

  const filtered = useMemo(() => jobs.filter((job) => {
    const haystack = `${job.title} ${job.company} ${job.skills.join(" ")}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (region === "All" || job.region === region) && (type === "All" || job.type === type) && (trackName === "All" || job.track === trackName) && (visa.length === 0 || visa.every((v) => job.visa.includes(v)));
  }).sort((a, b) => sort === "match" ? b.match - a.match : sort === "newest" ? b.posted.localeCompare(a.posted) : a.company.localeCompare(b.company)), [jobs, query, region, type, trackName, visa, sort]);

  function toggleVisa(value: string) { setVisa((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]); }

  return (
    <div className="jobs-page">
      <section className="jobs-hero"><div className="shell"><div className="eyebrow"><Sparkles size={14} /> CURATED FOR INTERNATIONAL STEM TALENT</div><h1>找到真正适合你的机会</h1><p>不仅看职位，更看匹配度、签证友好度与成长空间。</p><div className="job-search"><Search size={20} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索职位、公司或技能，例如：AI Engineer" /><button>搜索职位</button></div><div className="popular-searches"><span>热门：</span>{["New Grad", "AI Engineer", "H1B Sponsor", "Summer Intern"].map((item) => <button key={item} onClick={() => setQuery(item)}>{item}</button>)}</div></div></section>
      <div className="shell jobs-layout">
        <aside className="filters"><div className="filter-title"><span><SlidersHorizontal size={18} />筛选职位</span><button onClick={() => { setRegion("All"); setType("All"); setTrackName("All"); setVisa([]); }}>重置</button></div><FilterSelect label="地区" value={region} options={regions} onChange={setRegion} /><FilterSelect label="职位类型" value={type} options={types} onChange={setType} /><FilterSelect label="技术方向" value={trackName} options={tracks} onChange={setTrackName} /><div className="filter-group"><label>身份与签证</label>{visaFilters.map((item) => <label key={item} className="check-label"><input type="checkbox" checked={visa.includes(item)} onChange={() => toggleVisa(item)} /><span />{item}</label>)}</div><div className="filter-tip"><Sparkles size={17} /><b>让 AI 帮你筛选</b><p>完善 Career Profile，查看专属匹配分数。</p><button onClick={() => track("register_click", { source: "jobs_filter" })}>建立我的画像 <ArrowRight size={14} /></button></div></aside>
        <section className="job-results"><div className="results-head"><div><h2>{filtered.length} 个匹配职位</h2><p>岗位每日更新 · 最后同步于今天 09:30</p></div><label>排序：<select value={sort} onChange={(e) => setSort(e.target.value)}><option value="match">匹配度最高</option><option value="newest">最新发布</option><option value="company">公司名称</option></select><ChevronDown size={15} /></label></div>
          <div className="jobs-list">{filtered.map((job) => <article className="job-card" key={job.id}><div className="job-card-logo company-logo" style={{ background: job.companyColor }}>{job.companyInitials}</div><div className="job-card-main"><div className="job-card-title"><div><Link href={`/jobs/${job.id}`}>{job.title}</Link><p>{job.company}</p></div><button aria-label="收藏职位" onClick={() => track("job_save", { job_id: job.id })}><Bookmark size={19} /></button></div><div className="job-meta"><span><MapPin size={14} />{job.location}</span><span><BriefcaseBusiness size={14} />{job.type}</span><span>{job.salary}</span><span><Clock3 size={14} />截止 {job.deadline.replace(", 2026", "")}</span></div><div className="job-tags">{job.visa.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="job-card-bottom"><span>关键技能：{job.skills.slice(0, 3).join(" · ")}</span><Link href={`/jobs/${job.id}`}>查看详情 <ArrowRight size={15} /></Link></div></div><div className="card-match"><strong>{job.match}<small>%</small></strong><span>AI 匹配度</span><i><b style={{ height: `${job.match}%` }} /></i></div></article>)}</div>
          {filtered.length === 0 && <div className="empty-state"><Search size={28} /><h3>没有找到符合条件的职位</h3><p>试试减少筛选条件或搜索其他关键词。</p></div>}
        </section>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <div className="filter-group"><label>{label}</label><div className="select-wrap"><select value={value} onChange={(e) => onChange(e.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={15} /></div></div>;
}
