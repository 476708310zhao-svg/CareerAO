import React from 'react';
import { ArrowRight, Check, Sparkles, TriangleAlert } from 'lucide-react';

import ButtonLink from '../ui/ButtonLink';
import SectionHeading from '../ui/SectionHeading';

const strengths = ['算法与数据结构基础扎实', '两段高相关工程实习', '项目成果具备量化指标'];
const gaps = ['系统设计案例还不完整', '行为面试素材需要补充'];
const nextSteps = ['用 JD 重新优化简历关键词', '完成一轮系统设计模拟面试', '本周投递 8 个高匹配岗位'];

export default function AICareerCopilot() {
  return (
    <section data-home-section="copilot" className="zy-section overflow-hidden bg-white" aria-labelledby="copilot-title">
      <div className="zy-container">
        <div id="copilot-title"><SectionHeading eyebrow="AI CAREER COPILOT" title="你的 AI 求职助手" description="基于你的目标岗位与当前材料，识别差距，并把建议拆成可以马上执行的下一步。" align="center" /></div>

        <div className="relative mt-9">
          <div className="pointer-events-none absolute -inset-12 -z-10 bg-[radial-gradient(circle_at_25%_35%,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_72%_42%,rgba(139,92,246,0.16),transparent_38%),radial-gradient(circle_at_60%_88%,rgba(244,114,182,0.1),transparent_32%)] blur-3xl" />
          <div className="zy-color-shadow overflow-hidden rounded-[24px] border border-[#8b5cf6]/20 bg-[linear-gradient(135deg,#f1f7ff_0%,#ffffff_43%,#faf2ff_100%)] p-3 sm:p-5 lg:p-7">
          <div className="grid overflow-hidden rounded-[17px] border border-white/90 bg-white/65 lg:grid-cols-[280px_1fr]">
            <aside className="relative overflow-hidden border-b border-white/15 bg-[linear-gradient(155deg,#4f5de8_0%,#7c4ee7_58%,#d85da7_125%)] p-6 text-white lg:border-b-0 lg:border-r lg:p-7">
              <div className="pointer-events-none absolute -right-16 -top-12 h-48 w-48 rounded-full bg-[#22d3ee]/35 blur-3xl" />
              <div className="relative flex items-center gap-2 text-sm font-bold"><Sparkles className="h-4 w-4 text-[#bff8ff]" />职引 AI</div>
              <p className="mt-10 text-xs font-semibold text-white/50">当前目标</p>
              <h3 className="mt-2 text-xl font-bold leading-7">Google<br />Software Engineer</h3>
              <p className="mt-1 text-sm text-white/60">New Grad 2027</p>
              <div className="relative mt-8 rounded-2xl border border-white/20 bg-white/[0.11] p-4 backdrop-blur-sm">
                <p className="text-xs text-white/55">综合匹配度</p>
                <p className="mt-1 text-4xl font-bold tracking-[-0.05em]">92%</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded bg-white/20"><div className="h-full w-[92%] rounded bg-[linear-gradient(90deg,#bff8ff,#ffffff)]" /></div>
              </div>
            </aside>

            <div className="p-5 sm:p-7 lg:p-9">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[#34d399]/20 bg-[#effcf7] p-5">
                  <p className="text-sm font-bold text-[#168460]">你的优势</p>
                  <div className="mt-4 space-y-3">{strengths.map((item) => <p key={item} className="flex gap-2.5 text-sm leading-6 text-[#4c665d]"><Check className="mt-1 h-4 w-4 shrink-0 text-[#20ad7d]" />{item}</p>)}</div>
                </div>
                <div className="rounded-2xl border border-[#fb923c]/20 bg-[#fff7ed] p-5">
                  <p className="text-sm font-bold text-[#c76016]">还需补足</p>
                  <div className="mt-4 space-y-3">{gaps.map((item) => <p key={item} className="flex gap-2.5 text-sm leading-6 text-[#715b4b]"><TriangleAlert className="mt-1 h-4 w-4 shrink-0 text-[#fb923c]" />{item}</p>)}</div>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-[#5b6cff]/15 bg-white p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4"><p className="text-sm font-bold text-[#111]">建议的下一步</p><span className="rounded-lg bg-[#f2edff] px-2.5 py-1 text-xs font-bold text-[#7c4ee7]">本周计划</span></div>
                <ol className="mt-5 grid gap-3 md:grid-cols-3">{nextSteps.map((item, index) => <li key={item} className="rounded-xl bg-[linear-gradient(145deg,#f3f7ff,#f8f2ff)] p-4"><span className="zy-gradient-text text-xs font-bold">0{index + 1}</span><p className="mt-2 text-sm font-semibold leading-6 text-[#111]">{item}</p></li>)}</ol>
              </div>
              <div className="mt-6"><ButtonLink to="/career-planning">生成我的求职计划 <ArrowRight className="h-4 w-4" /></ButtonLink></div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
