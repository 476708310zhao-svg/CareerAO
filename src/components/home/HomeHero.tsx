import React, { useState } from 'react';
import { ArrowRight, BriefcaseBusiness, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { trackEvent } from '../../lib/analytics';
import ButtonLink from '../ui/ButtonLink';
import Tag from '../ui/Tag';

export default function HomeHero() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('Software Engineer');

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = keyword.trim();
    trackEvent('home_hero_search', { query_length: query.length });
    navigate(query ? `/jobs?keyword=${encodeURIComponent(query)}` : '/jobs');
  };

  return (
    <section data-home-section="hero" className="overflow-hidden bg-white pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36">
      <div className="zy-container">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-5 text-sm font-bold tracking-[0.08em] text-primary">CAREER, MADE CLEAR</p>
          <h1 className="zy-page-title text-[2.75rem] leading-[1.04] sm:text-6xl lg:text-[4.5rem]">
            <span className="block">留学生求职，</span>
            <span className="zy-gradient-text block">从这里开始。</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#606060] sm:text-lg sm:leading-8">
            找职位、做准备、练面试、管进度。职引把复杂的求职过程，变成清晰的下一步。
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink to="/jobs" onClick={() => trackEvent('home_hero_jobs_click')} className="w-full sm:w-auto">
              开始找职位 <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink to="/ai-interview" variant="secondary" onClick={() => trackEvent('home_hero_tools_click')} className="w-full sm:w-auto">
              体验求职工具
            </ButtonLink>
          </div>
        </div>

        <div className="relative mx-auto mt-10 max-w-5xl sm:mt-12">
          <div className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(circle_at_32%_45%,rgba(34,211,238,0.13),transparent_35%),radial-gradient(circle_at_70%_35%,rgba(139,92,246,0.13),transparent_38%),radial-gradient(circle_at_55%_80%,rgba(91,108,255,0.1),transparent_35%)] blur-2xl" />
          <div className="zy-color-shadow relative overflow-hidden rounded-[24px] border border-[#5b6cff]/15 bg-white p-3 sm:p-5 lg:p-7">
          <div className="rounded-[17px] border border-white bg-[linear-gradient(135deg,#f2f8ff_0%,#ffffff_46%,#f7f1ff_100%)] p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between border-b border-black/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#5b6cff,#8b5cf6)] text-white shadow-[0_8px_18px_rgba(91,108,255,0.24)]"><BriefcaseBusiness className="h-4 w-4" /></span>
                <div><p className="text-sm font-bold text-[#111]">职位搜索</p><p className="text-xs text-[#8a8a86]">为留学生筛选真实机会</p></div>
              </div>
              <span className="hidden text-xs font-semibold text-[#8a8a86] sm:block">2,846 个开放职位</span>
            </div>

            <form onSubmit={submitSearch} className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
              <label className="relative block">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8a86]" />
                <input value={keyword} onChange={(event) => setKeyword(event.target.value)} aria-label="职位关键词" className="h-12 w-full rounded-xl border border-black/[0.1] bg-white pl-11 pr-4 text-sm text-[#111] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" />
              </label>
              <button type="submit" className="zy-button zy-button-primary">搜索职位</button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              <Tag tone="blue">New Grad</Tag><Tag tone="cyan">SWE</Tag><Tag tone="orange">United States</Tag><Tag tone="green">Visa Friendly</Tag><Tag tone="purple">AI Recommended</Tag>
            </div>

            <div className="mt-5 grid gap-4 rounded-2xl border border-black/[0.08] bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-center lg:p-6">
              <div className="flex min-w-0 gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-black/[0.08] bg-white text-lg font-black"><span className="bg-[linear-gradient(135deg,#4285f4_20%,#34a853_45%,#fbbc05_68%,#ea4335_82%)] bg-clip-text text-transparent">G</span></span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#8a8a86]">Google · Mountain View, CA</p>
                  <h2 className="mt-1 truncate text-base font-bold text-[#111] sm:text-lg">Software Engineer, New Grad 2027</h2>
                  <div className="mt-3 flex flex-wrap gap-2"><Tag tone="green">Visa Friendly</Tag><Tag tone="blue">New Grad</Tag><Tag tone="cyan">Full-time</Tag></div>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between gap-4 border-t border-black/[0.07] pt-4 sm:mt-0 sm:block sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 sm:text-right">
                <p className="text-xs font-semibold text-[#8a8a86]">岗位匹配度</p>
                <p className="zy-gradient-text mt-1 text-2xl font-bold tracking-[-0.04em]">96%</p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
