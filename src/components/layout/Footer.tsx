import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode } from 'lucide-react';

import { footerLinkGroups } from '../../config/footer';
import Logo from '../Logo';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#111111] py-14 text-white sm:py-16">
      <div className="pointer-events-none absolute -right-36 -top-48 h-96 w-96 rounded-full bg-[#5b6cff]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-52 left-1/4 h-96 w-96 rounded-full bg-[#8b5cf6]/10 blur-3xl" />
      <div className="zy-container relative">
        <div className="grid gap-12 lg:grid-cols-[260px_1fr_150px] lg:gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2.5" aria-label="职引首页"><Logo className="h-8 w-8" /><span className="text-lg font-bold tracking-[-0.03em] text-white">职引 Career</span></Link>
            <p className="mt-5 max-w-[240px] text-sm leading-6 text-white/55">让留学生求职过程更清晰：找到机会，做好准备，走向下一步。</p>
            <div className="mt-6 h-1 w-20 rounded bg-[linear-gradient(90deg,#5b6cff,#8b5cf6,#f472b6)]" />
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 xl:grid-cols-5">
            {footerLinkGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-bold text-white">{group.title}</h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => <li key={link.href}><Link to={link.href} className="text-sm text-white/50 transition hover:text-[#9da7ff]">{link.label}</Link></li>)}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-4 lg:block">
            <div className="h-[112px] w-[112px] shrink-0 overflow-hidden rounded-xl border border-white/15 bg-white p-1.5">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-white text-[#8a8a86]">
                <img src="/wechat-qr.jpg" alt="职引微信二维码" className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = 'none'; event.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
                <QrCode className="hidden h-10 w-10" />
              </div>
            </div>
            <div><p className="mt-1 text-sm font-bold text-white lg:mt-3">微信咨询</p><p className="mt-1 text-xs leading-5 text-white/45">获取求职建议与产品帮助</p></div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 职引 Career. All rights reserved.</p>
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer" className="transition hover:text-[#9da7ff]">蜀ICP备2026003605号</a>
        </div>
      </div>
    </footer>
  );
}
