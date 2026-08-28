import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function HomeCTA({ onRegister }: { onRegister: () => void }) {
  return (
    <section data-home-section="cta" className="zy-section bg-white">
      <div className="zy-container">
        <div className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(120deg,#4f5de8_0%,#7c4ee7_58%,#c657a5_120%)] px-6 py-16 text-center text-white shadow-[0_28px_70px_rgba(91,108,255,0.24)] sm:px-10 sm:py-20 lg:py-24">
          <div className="pointer-events-none absolute -left-20 -top-28 h-64 w-64 rounded-full bg-[#22d3ee]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-16 h-72 w-72 rounded-full bg-[#f472b6]/25 blur-3xl" />
          <div className="relative">
            <h2 className="text-[2.35rem] font-bold leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-[3.25rem]">开始你的下一次申请</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">找到目标岗位，然后一步一步准备好。</p>
            <button type="button" onClick={onRegister} className="zy-button mt-8 bg-white text-[#4f5de8] shadow-[0_10px_28px_rgba(29,32,76,0.2)] hover:bg-[#f7f5ff]">免费开始使用 <ArrowRight className="h-4 w-4" /></button>
            <p className="mt-4 text-xs font-medium text-white/60">无需付费 · 注册即可使用</p>
          </div>
        </div>
      </div>
    </section>
  );
}
