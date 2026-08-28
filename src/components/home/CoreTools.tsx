import React from 'react';
import { ArrowRight, Bot, FileCheck2, FileText, MessageSquareText } from 'lucide-react';
import { Link } from 'react-router-dom';

import SectionHeading from '../ui/SectionHeading';

const tools = [
  {
    title: 'AI 模拟面试',
    description: '针对目标岗位生成问题，即时分析表达、结构与内容。',
    href: '/ai-interview',
    icon: Bot,
    theme: {
      card: 'border-[#8b5cf6]/20 bg-[linear-gradient(145deg,#f5f1ff,#eef4ff)] hover:from-[#eee8ff] hover:to-[#e8f0ff] hover:shadow-[0_22px_55px_rgba(139,92,246,0.16)]',
      icon: 'bg-[linear-gradient(135deg,#8b5cf6,#5b6cff)]',
      screen: 'border-[#8b5cf6]/15 bg-white/80',
      accent: '#8b5cf6',
    },
    screen: (
      <>
        <div className="flex items-center justify-between"><p className="text-xs font-semibold text-[#7c4ee7]">面试问题 3 / 8</p><span className="h-2 w-2 rounded-full bg-[#34d399] shadow-[0_0_0_4px_rgba(52,211,153,0.14)]" /></div>
        <p className="mt-3 text-sm font-bold leading-6 text-[#111]">Tell me about a project where you improved system performance.</p>
        <div className="mt-5 flex h-10 items-end gap-1.5">{[36, 62, 48, 76, 42, 68, 54, 30, 58, 44].map((height, index) => <span key={index} className="w-1.5 rounded bg-[linear-gradient(180deg,#8b5cf6,#5b6cff)]" style={{ height: `${height}%` }} />)}</div>
      </>
    ),
  },
  {
    title: '简历优化',
    description: '对照 JD 检查 ATS 关键词、经历表达与成果可信度。',
    href: '/resume-tailor',
    icon: FileCheck2,
    theme: {
      card: 'border-[#22d3ee]/20 bg-[linear-gradient(145deg,#edfbff,#eef6ff)] hover:from-[#e3faff] hover:to-[#e6f1ff] hover:shadow-[0_22px_55px_rgba(34,211,238,0.16)]',
      icon: 'bg-[linear-gradient(135deg,#22d3ee,#38bdf8)]',
      screen: 'border-[#22d3ee]/20 bg-white/80',
      accent: '#22b8d4',
    },
    screen: (
      <>
        <div className="flex items-end justify-between"><p className="text-xs font-semibold text-[#147f99]">JD 匹配分</p><p className="bg-[linear-gradient(135deg,#22d3ee,#5b6cff)] bg-clip-text text-3xl font-bold text-transparent">86</p></div>
        <div className="mt-3 h-2 overflow-hidden rounded bg-[#dff5fa]"><div className="h-full w-[86%] rounded bg-[linear-gradient(90deg,#22d3ee,#38bdf8)]" /></div>
        <p className="mt-4 text-xs leading-5 text-[#606060]">建议补充：distributed systems、performance optimization</p>
      </>
    ),
  },
  {
    title: '网申助手',
    description: '把个人经历整理成准确、自然、符合字数要求的回答。',
    href: '/application-assistant',
    icon: FileText,
    theme: {
      card: 'border-[#f472b6]/20 bg-[linear-gradient(145deg,#fff5ed,#fff0f8)] hover:from-[#fff0e3] hover:to-[#ffe8f4] hover:shadow-[0_22px_55px_rgba(244,114,182,0.16)]',
      icon: 'bg-[linear-gradient(135deg,#fb923c,#f472b6)]',
      screen: 'border-[#f472b6]/18 bg-white/80',
      accent: '#e15f91',
    },
    screen: (
      <>
        <p className="text-xs font-semibold text-[#c84f8c]">Why do you want to join us?</p>
        <div className="mt-4 space-y-2.5">{[92, 100, 78].map((width, index) => <div key={index} className="h-2 rounded bg-[linear-gradient(90deg,rgba(251,146,60,0.28),rgba(244,114,182,0.3))]" style={{ width: `${width}%` }} />)}</div>
        <p className="mt-4 text-right text-[11px] font-semibold text-[#e15f91]">183 / 200 words</p>
      </>
    ),
  },
  {
    title: '笔经面经',
    description: '按公司和岗位查看真实流程、常见题型与准备重点。',
    href: '/interview-experiences',
    icon: MessageSquareText,
    theme: {
      card: 'border-[#34d399]/20 bg-[linear-gradient(145deg,#edfcf6,#ecfbff)] hover:from-[#e4fbee] hover:to-[#e2faff] hover:shadow-[0_22px_55px_rgba(52,211,153,0.16)]',
      icon: 'bg-[linear-gradient(135deg,#34d399,#22d3ee)]',
      screen: 'border-[#34d399]/20 bg-white/80',
      accent: '#168460',
    },
    screen: (
      <>
        <div className="flex items-center justify-between"><p className="text-xs font-bold text-[#168460]">Google SWE 面经</p><span className="rounded-lg bg-[#eafbf4] px-2 py-1 text-[10px] font-semibold text-[#168460]">2026 校招</span></div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-[#557067]">{['OA', 'Technical', 'Behavioral'].map((item) => <span key={item} className="rounded-lg border border-[#34d399]/15 bg-white py-2">{item}</span>)}</div>
      </>
    ),
  },
];

export default function CoreTools() {
  return (
    <section id="core-tools" data-home-section="tools" className="zy-section bg-white" aria-labelledby="tools-title">
      <div className="zy-container">
        <div id="tools-title"><SectionHeading eyebrow="CORE TOOLS" title="把关键准备，做得更扎实" description="四个高频工具，分别解决面试、简历、网申和信息准备中的核心问题。" /></div>
        <div className="mt-9 grid gap-5 md:grid-cols-2">
          {tools.map(({ title, description, href, icon: Icon, screen, theme }) => (
            <Link key={title} to={href} className={`group grid min-h-[350px] gap-7 rounded-[22px] border p-7 transition duration-300 hover:-translate-y-1 sm:grid-cols-[0.8fr_1.2fr] sm:p-8 ${theme.card}`}>
              <div className="flex flex-col">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm ${theme.icon}`}><Icon className="h-5 w-5" /></span>
                <h3 className="mt-6 text-2xl font-bold tracking-[-0.03em] text-[#111]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#606060]">{description}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold transition group-hover:translate-x-0.5" style={{ color: theme.accent }}>立即体验 <ArrowRight className="h-4 w-4" /></span>
              </div>
              <div className={`self-end rounded-2xl border p-5 shadow-[0_14px_30px_rgba(17,17,17,0.04)] ${theme.screen}`}>{screen}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
