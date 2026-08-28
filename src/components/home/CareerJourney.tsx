import React from 'react';
import { ArrowRight, Check, FileSearch, Route, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

import SectionHeading from '../ui/SectionHeading';
import Tag from '../ui/Tag';

const journeys = [
  {
    step: '01',
    title: '找机会',
    description: '从职位、签证和时间线出发，建立真正值得投入的目标清单。',
    items: ['职位搜索', '智能推荐', '校招日历', '求职地图'],
    href: '/jobs',
    action: '开始找机会',
    icon: FileSearch,
    theme: { card: 'border-[#38bdf8]/20 bg-[linear-gradient(145deg,#effaff_0%,#ffffff_72%)] hover:shadow-[0_24px_60px_rgba(56,189,248,0.16)]', icon: 'bg-[linear-gradient(135deg,#22d3ee,#5b6cff)]', text: 'text-[#2476d6]', mockup: 'bg-[#eaf8ff]' },
    mockup: (
      <div className="space-y-3">
        {['Software Engineer', 'Product Manager', 'Data Scientist'].map((item, index) => (
          <div key={item} className="flex items-center gap-3 rounded-xl border border-black/[0.07] bg-white p-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f7ff] text-xs font-bold text-[#2476d6]">{index + 1}</span>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#111]">{item}</span>
            <span className="text-xs font-bold text-primary">{94 - index * 3}%</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    step: '02',
    title: '做准备',
    description: '围绕目标岗位完善材料、练习表达，让每次申请更有准备。',
    items: ['简历优化', '网申助手', '笔经面经', 'AI 模拟面试'],
    href: '/resume-tailor',
    action: '开始做准备',
    icon: Target,
    theme: { card: 'border-[#8b5cf6]/20 bg-[linear-gradient(145deg,#f7f1ff_0%,#fff8fc_52%,#ffffff_100%)] hover:shadow-[0_24px_60px_rgba(139,92,246,0.15)]', icon: 'bg-[linear-gradient(135deg,#8b5cf6,#f472b6)]', text: 'text-[#7c4ee7]', mockup: 'bg-[#f5efff]' },
    mockup: (
      <div className="rounded-xl border border-black/[0.07] bg-white p-4">
        <div className="flex items-center justify-between text-xs font-semibold"><span className="text-[#606060]">简历完成度</span><span className="text-primary">82%</span></div>
        <div className="mt-3 h-2 overflow-hidden rounded bg-[#eee5fb]"><div className="h-full w-[82%] rounded bg-[linear-gradient(90deg,#8b5cf6,#f472b6)]" /></div>
        <div className="mt-4 space-y-2">
          {['补充量化结果', '突出 React 项目经历'].map((item) => <p key={item} className="flex items-center gap-2 text-xs text-[#606060]"><Check className="h-3.5 w-3.5 text-[#8b5cf6]" />{item}</p>)}
        </div>
      </div>
    ),
  },
  {
    step: '03',
    title: '做决策',
    description: '比较薪资、公司与发展路径，判断下一步应该把时间花在哪里。',
    items: ['薪资查询', '公司信息', '求职规划', '机构测评'],
    href: '/salary-insights',
    action: '辅助求职决策',
    icon: Route,
    theme: { card: 'border-[#fb923c]/20 bg-[linear-gradient(145deg,#fff8eb_0%,#fff4f8_58%,#ffffff_100%)] hover:shadow-[0_24px_60px_rgba(251,146,60,0.15)]', icon: 'bg-[linear-gradient(135deg,#fb923c,#f472b6)]', text: 'text-[#d66b24]', mockup: 'bg-[#fff4e7]' },
    mockup: (
      <div className="grid grid-cols-3 gap-2">
        {[
          ['薪资', '$168k'],
          ['匹配', '92%'],
          ['优先级', 'A'],
        ].map(([label, value], index) => <div key={label} className="rounded-xl border border-[#fb923c]/10 bg-white p-3 text-center"><p className="text-[11px] text-[#8a8a86]">{label}</p><p className={`mt-1 text-sm font-bold ${index === 1 ? 'text-[#e15f91]' : 'text-[#d66b24]'}`}>{value}</p></div>)}
      </div>
    ),
  },
];

export default function CareerJourney() {
  return (
    <section data-home-section="journey" className="zy-section bg-white" aria-labelledby="journey-title">
      <div className="zy-container">
        <div id="journey-title"><SectionHeading eyebrow="CAREER JOURNEY" title="每一步，都知道接下来做什么" description="不是堆叠更多工具，而是围绕你的目标，把机会、准备和决策连成一条清晰路径。" /></div>
        <div className="mt-9 grid gap-5 lg:grid-cols-3">
          {journeys.map(({ step, title, description, items, href, action, icon: Icon, mockup, theme }) => (
            <article key={title} className={`flex min-h-[520px] flex-col rounded-[22px] border p-7 transition duration-300 hover:-translate-y-1 sm:p-8 ${theme.card}`}>
              <div className="flex items-center justify-between"><span className={`text-sm font-bold ${theme.text}`}>{step}</span><span className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm ${theme.icon}`}><Icon className="h-5 w-5" /></span></div>
              <h3 className="mt-8 text-2xl font-bold tracking-[-0.03em] text-[#111]">{title}</h3>
              <p className="mt-3 min-h-[72px] text-sm leading-6 text-[#606060]">{description}</p>
              <div className="mt-5 flex flex-wrap gap-2">{items.map((item) => <Tag key={item} tone={title === '找机会' ? 'blue' : title === '做准备' ? 'purple' : 'orange'}>{item}</Tag>)}</div>
              <div className={`mt-7 rounded-2xl p-4 ${theme.mockup}`}>{mockup}</div>
              <Link to={href} className={`mt-auto inline-flex items-center gap-2 pt-7 text-sm font-bold transition hover:translate-x-0.5 ${theme.text}`}>{action}<ArrowRight className="h-4 w-4" /></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
