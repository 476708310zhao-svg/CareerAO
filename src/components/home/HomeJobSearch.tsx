import React, { useEffect, useState } from 'react';
import { ArrowRight, Clock3, MapPin, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { curatedJobs } from '../../data/curatedJobs';
import { apiFetch } from '../../lib/api';
import { trackEvent } from '../../lib/analytics';
import SectionHeading from '../ui/SectionHeading';
import Tag from '../ui/Tag';

type HomeJob = {
  id: string | number;
  title: string;
  company: string;
  location?: string;
  jobType?: string;
  visaSponsored?: boolean;
  postedAt?: string;
  updatedAt?: string;
  requirements?: string[];
};

const filters = ['New Grad', 'Internship', 'OPT', 'H-1B', 'SWE', 'Data'];

const jobAccents = [
  { card: 'from-[#f4f6ff] to-white hover:from-[#edf0ff]', logo: 'from-[#5b6cff] to-[#8b5cf6]' },
  { card: 'from-[#ecfbff] to-white hover:from-[#e2f9ff]', logo: 'from-[#22d3ee] to-[#38bdf8]' },
  { card: 'from-[#fff3fa] to-white hover:from-[#ffebf5]', logo: 'from-[#f472b6] to-[#8b5cf6]' },
  { card: 'from-[#fff7ed] to-white hover:from-[#fff0df]', logo: 'from-[#fb923c] to-[#f472b6]' },
];

const normalizeJobs = (input: unknown): HomeJob[] => {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  return input.flatMap((item: any) => {
    const id = String(item?.id ?? '').trim();
    const title = typeof item?.title === 'string' ? item.title.trim() : '';
    const company = typeof item?.company === 'string' ? item.company.trim() : '';
    if (!id || !title || !company || seen.has(id) || item?.isExpired === true) return [];
    seen.add(id);
    return [{
      id,
      title,
      company,
      location: typeof item.location === 'string' ? item.location : '',
      jobType: typeof item.jobType === 'string' ? item.jobType : '',
      visaSponsored: item.visaSponsored === true,
      postedAt: typeof item.postedAt === 'string' ? item.postedAt : '',
      updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : '',
      requirements: Array.isArray(item.requirements) ? item.requirements : [],
    }];
  }).slice(0, 4);
};

const formatDate = (value?: string) => {
  if (!value) return '最近更新';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '最近更新';
  return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
};

export default function HomeJobSearch() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [jobs, setJobs] = useState<HomeJob[]>(normalizeJobs(curatedJobs));
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiFetch('/api/proxy/jobs?page=1&pageSize=6')
      .then((response) => {
        const next = normalizeJobs(response.data?.list);
        if (!cancelled && next.length >= 3) {
          setJobs(next);
          setLive(!String(response.data?.source || '').includes('fallback'));
        }
      })
      .catch((error) => console.warn('Homepage jobs fallback:', error));
    return () => { cancelled = true; };
  }, []);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = keyword.trim();
    trackEvent('home_job_search', { query_length: query.length });
    navigate(query ? `/jobs?keyword=${encodeURIComponent(query)}` : '/jobs');
  };

  return (
    <section data-home-section="jobs" className="zy-section bg-white" aria-labelledby="home-jobs-title">
      <div className="zy-container">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div id="home-jobs-title"><SectionHeading eyebrow="JOB SEARCH" title="找到真正适合你的机会" description="从签证支持、毕业年份到岗位方向，把不合适的机会更早筛掉。" /></div>
          <span className={`w-fit rounded-lg px-3 py-2 text-xs font-semibold ${live ? 'bg-[#eafbf4] text-[#168460]' : 'bg-[#f2edff] text-[#7c4ee7]'}`}>{live ? '职位数据实时更新' : 'AI 精选职位'}</span>
        </div>

        <form onSubmit={submitSearch} className="mt-10 grid gap-3 rounded-[20px] border border-[#5b6cff]/20 bg-[linear-gradient(110deg,#f7f9ff,#ffffff,#faf6ff)] p-3 shadow-[0_18px_45px_rgba(91,108,255,0.1)] sm:grid-cols-[1fr_auto]">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8a8a86]" />
            <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索职位、公司或关键词" aria-label="搜索职位、公司或关键词" className="h-12 w-full rounded-xl border-0 bg-transparent pl-12 pr-4 text-base text-[#111] outline-none placeholder:text-[#8a8a86]" />
          </label>
          <button type="submit" className="zy-button zy-button-primary">搜索职位</button>
        </form>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((filter) => <button key={filter} type="button" onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(filter)}`)} className="shrink-0 rounded-xl border border-black/[0.09] bg-white px-3.5 py-2 text-sm font-semibold text-[#606060] transition hover:border-primary hover:text-primary">{filter}</button>)}
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {jobs.map((job, index) => (
            <Link key={String(job.id)} to={`/jobs/${encodeURIComponent(String(job.id))}`} onClick={() => trackEvent('home_job_card_click', { job_id: String(job.id) })} className={`group rounded-[22px] border border-black/[0.07] bg-gradient-to-br ${jobAccents[index % jobAccents.length].card} p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(91,108,255,0.11)] sm:p-7`}>
              <div className="flex items-start justify-between gap-4">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${jobAccents[index % jobAccents.length].logo} text-base font-bold text-white shadow-sm`}>{job.company.charAt(0)}</span>
                <ArrowRight className="h-5 w-5 text-[#b0b0ac] transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <p className="mt-6 text-sm font-semibold text-[#606060]">{job.company}</p>
              <h3 className="mt-1 line-clamp-2 text-xl font-bold tracking-[-0.025em] text-[#111]">{job.title}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.visaSponsored ? <Tag tone="green">Visa Friendly</Tag> : null}
                {job.title.toLowerCase().includes('new grad') ? <Tag tone="blue">New Grad</Tag> : null}
                {job.jobType ? <Tag tone={job.jobType.includes('实习') ? 'cyan' : 'purple'}>{job.jobType}</Tag> : null}
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.07] pt-4 text-xs font-medium text-[#8a8a86]">
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{job.location || '地点待定'}</span>
                <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{formatDate(job.updatedAt || job.postedAt)}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6"><Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-[#111] hover:text-primary">查看全部职位 <ArrowRight className="h-4 w-4" /></Link></div>
      </div>
    </section>
  );
}
