import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';

const articles = [
  { category: 'New Grad', title: '2027 届北美科技公司校招时间线', description: '从开放申请到面试批次，整理近期值得关注的 New Grad 节点。', date: '2026.08.26', href: '/campus-calendar', badge: 'bg-[#edf0ff] text-[#4f5de8]', art: 'from-[#5b6cff] via-[#38bdf8] to-[#22d3ee]' },
  { category: 'Interview', title: 'Google SWE 面试：高频题型与准备框架', description: '从 Coding 到 Behavioral，按轮次拆解常见问题和复盘方法。', date: '2026.08.22', href: '/interview-experiences', badge: 'bg-[#f2edff] text-[#7c4ee7]', art: 'from-[#8b5cf6] via-[#a855f7] to-[#f472b6]' },
  { category: 'Visa', title: 'OPT、CPT 与 H-1B：求职前需要确认什么', description: '用一份清单快速确认身份时间线、雇主支持与申请风险。', date: '2026.08.18', href: '/visa-policies', badge: 'bg-[#eafbf4] text-[#168460]', art: 'from-[#34d399] via-[#22d3ee] to-[#38bdf8]' },
];

export default function HomeContent() {
  return (
    <section data-home-section="content" className="zy-section bg-white" aria-labelledby="content-title">
      <div className="zy-container">
        <div id="content-title"><SectionHeading eyebrow="INSIGHTS" title="最近值得关注" description="重要校招节点、真实面试经验和留学生需要留意的政策信息。" /></div>
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.title} to={article.href} className="group overflow-hidden rounded-[22px] border border-black/[0.07] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(91,108,255,0.11)]">
              <div className={`relative h-32 overflow-hidden bg-gradient-to-br ${article.art}`}>
                <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full border-[22px] border-white/20" />
                <div className="absolute bottom-4 left-5 right-5 h-12 rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm"><div className="m-3 h-2 w-2/3 rounded bg-white/75" /><div className="mx-3 h-1.5 w-1/2 rounded bg-white/45" /></div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between"><span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${article.badge}`}>{article.category}</span><span className="text-xs text-[#888]">{article.date}</span></div>
                <h3 className="mt-5 text-xl font-bold tracking-[-0.025em] text-[#111] transition group-hover:text-primary">{article.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#606060]">{article.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#111] group-hover:text-primary">阅读全文 <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8"><Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-[#111] hover:text-primary">查看全部内容 <ArrowRight className="h-4 w-4" /></Link></div>
      </div>
    </section>
  );
}
