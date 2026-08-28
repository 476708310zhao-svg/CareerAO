import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Bookmark, ChevronDown, FileText, LogOut, Menu, User, X } from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { apiFetch } from '../../lib/api';
import { trackEvent } from '../../lib/analytics';
import Logo from '../Logo';

const toolGroups = [
  { title: '准备', links: [{ label: '简历优化', href: '/resume-tailor' }, { label: '求职规划', href: '/career-planning' }, { label: '网申助手', href: '/application-assistant' }] },
  { title: '面试', links: [{ label: 'AI 模拟面试', href: '/ai-interview' }, { label: '笔经面经', href: '/interview-experiences' }] },
  { title: '决策', links: [{ label: '薪资查询', href: '/salary-insights' }, { label: '机构测评', href: '/agency-evaluation' }] },
];

const resources = [
  { label: '校招日历', description: '掌握申请开放与截止时间', href: '/campus-calendar' },
  { label: '求职资讯', description: '近期校招与行业动态', href: '/news' },
  { label: '求职攻略', description: '从投递到 Offer 的实用方法', href: '/blog' },
  { label: '签证政策', description: '留学生身份与工作签证信息', href: '/visa-policies' },
];

const isRouteActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<'tools' | 'resources' | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigationRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    setIsMobileOpen(false);
    setOpenMenu(null);
    setIsAccountOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isMobileOpen]);

  useEffect(() => {
    if (!isAuthenticated) { setUnreadCount(0); return; }
    apiFetch('/api/proxy/messages/unread-count').then((response) => setUnreadCount(Number(response.data?.count) || 0)).catch(() => setUnreadCount(0));
  }, [isAuthenticated, location.pathname]);

  useEffect(() => {
    const closeMenus = (event: MouseEvent) => {
      const target = event.target as Node;
      if (navigationRef.current && !navigationRef.current.contains(target)) setOpenMenu(null);
      if (accountRef.current && !accountRef.current.contains(target)) setIsAccountOpen(false);
    };
    document.addEventListener('mousedown', closeMenus);
    return () => document.removeEventListener('mousedown', closeMenus);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsAccountOpen(false);
    showToast('已成功退出登录', 'success');
  };

  const accountLinks = (
    <>
      <Link to="/my-resume" className="flex items-center rounded-lg px-3 py-2 text-sm text-[#606060] transition hover:bg-[#f7f7f5] hover:text-primary"><User className="mr-2 h-4 w-4" />个人中心</Link>
      <Link to="/favorites" className="flex items-center rounded-lg px-3 py-2 text-sm text-[#606060] transition hover:bg-[#f7f7f5] hover:text-primary"><Bookmark className="mr-2 h-4 w-4" />我的收藏</Link>
      <Link to="/messages" className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-[#606060] transition hover:bg-[#f7f7f5] hover:text-primary"><span className="flex items-center"><Bell className="mr-2 h-4 w-4" />消息中心</span>{unreadCount > 0 ? <span className="rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{unreadCount > 99 ? '99+' : unreadCount}</span> : null}</Link>
      <Link to="/application-tracker" className="flex items-center rounded-lg px-3 py-2 text-sm text-[#606060] transition hover:bg-[#f7f7f5] hover:text-primary"><FileText className="mr-2 h-4 w-4" />投递追踪</Link>
    </>
  );

  return (
    <nav onKeyDown={(event) => { if (event.key === 'Escape') { setOpenMenu(null); setIsAccountOpen(false); setIsMobileOpen(false); } }} className="fixed inset-x-0 top-0 z-50 border-b border-black/[0.06] bg-white/95 backdrop-blur-lg" aria-label="主导航">
      <div className="zy-container flex h-[72px] items-center justify-between">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="职引首页"><Logo className="h-8 w-8" /><span className="text-[18px] font-bold tracking-[-0.035em] text-[#111]">职引 Career</span></Link>

        <div ref={navigationRef} className="hidden h-full items-center gap-8 lg:flex">
          <Link to="/jobs" className={`text-sm font-semibold transition ${isRouteActive(location.pathname, '/jobs') ? 'text-primary' : 'text-[#606060] hover:text-[#111]'}`}>找工作</Link>
          <div className="relative flex h-full items-center" onMouseEnter={() => setOpenMenu('tools')} onMouseLeave={() => setOpenMenu(null)}>
            <button type="button" onClick={() => setOpenMenu((value) => value === 'tools' ? null : 'tools')} aria-expanded={openMenu === 'tools'} aria-controls="tools-menu" className={`flex h-full items-center gap-1 text-sm font-semibold transition ${toolGroups.some((group) => group.links.some((link) => isRouteActive(location.pathname, link.href))) ? 'text-primary' : 'text-[#606060] hover:text-[#111]'}`}>求职工具 <ChevronDown className={`h-3.5 w-3.5 transition ${openMenu === 'tools' ? 'rotate-180' : ''}`} /></button>
            {openMenu === 'tools' ? <div id="tools-menu" className="absolute left-1/2 top-[68px] w-[620px] -translate-x-1/2 rounded-2xl border border-black/[0.08] bg-white p-5 shadow-[0_20px_60px_rgba(17,17,17,0.09)]"><div className="grid grid-cols-3 gap-5">{toolGroups.map((group) => <div key={group.title}><p className="mb-2 px-3 text-xs font-bold text-[#8a8a86]">{group.title}</p><div className="space-y-1">{group.links.map((link) => <Link key={link.href} to={link.href} className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-[#111] transition hover:bg-[#f7f7f5] hover:text-primary">{link.label}</Link>)}</div></div>)}</div></div> : null}
          </div>
          <div className="relative flex h-full items-center" onMouseEnter={() => setOpenMenu('resources')} onMouseLeave={() => setOpenMenu(null)}>
            <button type="button" onClick={() => setOpenMenu((value) => value === 'resources' ? null : 'resources')} aria-expanded={openMenu === 'resources'} aria-controls="resources-menu" className={`flex h-full items-center gap-1 text-sm font-semibold transition ${resources.some((link) => isRouteActive(location.pathname, link.href)) ? 'text-primary' : 'text-[#606060] hover:text-[#111]'}`}>资源 <ChevronDown className={`h-3.5 w-3.5 transition ${openMenu === 'resources' ? 'rotate-180' : ''}`} /></button>
            {openMenu === 'resources' ? <div id="resources-menu" className="absolute left-1/2 top-[68px] w-[430px] -translate-x-1/2 rounded-2xl border border-black/[0.08] bg-white p-3 shadow-[0_20px_60px_rgba(17,17,17,0.09)]"><div className="grid grid-cols-2 gap-1">{resources.map((item) => <Link key={item.href} to={item.href} className="rounded-xl p-3 transition hover:bg-[#f7f7f5]"><span className="block text-sm font-bold text-[#111]">{item.label}</span><span className="mt-1 block text-xs leading-5 text-[#8a8a86]">{item.description}</span></Link>)}</div></div> : null}
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated && user ? (
            <div ref={accountRef} className="relative">
              <button type="button" onClick={() => setIsAccountOpen((open) => !open)} aria-expanded={isAccountOpen} className="flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-bold text-[#606060] transition hover:bg-[#f7f7f5]"><span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg bg-blue-50 text-primary">{user.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : <User className="h-4 w-4" />}</span><span className="max-w-24 truncate">{user.nickname}</span><ChevronDown className="h-3.5 w-3.5 text-[#8a8a86]" /></button>
              {isAccountOpen ? <div className="absolute right-0 top-12 w-52 rounded-xl border border-black/[0.08] bg-white p-2 shadow-[0_16px_40px_rgba(17,17,17,0.1)]">{accountLinks}<div className="my-1 border-t border-black/[0.07]" /><button type="button" onClick={handleLogout} className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"><LogOut className="mr-2 h-4 w-4" />退出登录</button></div> : null}
            </div>
          ) : <><button type="button" onClick={() => { trackEvent('navbar_auth_click', { mode: 'login' }); openAuthModal('login'); }} className="zy-button h-10 min-h-10 bg-transparent px-4 text-[#606060] hover:bg-[#f5f6ff] hover:text-[#111]">登录</button><button type="button" onClick={() => { trackEvent('navbar_auth_click', { mode: 'register' }); openAuthModal('register', '/jobs'); }} className="zy-button zy-button-primary h-10 min-h-10 px-4">免费开始</button></>}
        </div>

        <button type="button" onClick={() => setIsMobileOpen((open) => !open)} aria-expanded={isMobileOpen} aria-controls="mobile-navigation" aria-label={isMobileOpen ? '关闭菜单' : '打开菜单'} className="flex h-10 w-10 items-center justify-center rounded-xl text-[#606060] transition hover:bg-[#f7f7f5] lg:hidden">{isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      </div>

      {isMobileOpen ? (
        <div id="mobile-navigation" className="fixed inset-x-0 top-[72px] h-[calc(100dvh-72px)] overflow-y-auto border-t border-black/[0.06] bg-white px-5 py-6 lg:hidden">
          <Link to="/jobs" className="block rounded-xl py-3 text-base font-bold text-[#111]">找工作</Link>
          {toolGroups.map((group) => <div key={group.title} className="mt-6"><p className="text-xs font-bold text-[#8a8a86]">求职工具 · {group.title}</p><div className="mt-2 grid grid-cols-2 gap-1">{group.links.map((link) => <Link key={link.href} to={link.href} className="rounded-xl py-2.5 text-sm font-semibold text-[#606060]">{link.label}</Link>)}</div></div>)}
          <div className="mt-6 border-t border-black/[0.07] pt-6"><p className="text-xs font-bold text-[#8a8a86]">资源</p><div className="mt-2 grid grid-cols-2 gap-1">{resources.map((link) => <Link key={link.href} to={link.href} className="rounded-xl py-2.5 text-sm font-semibold text-[#606060]">{link.label}</Link>)}</div></div>
          <div className="mt-6 border-t border-black/[0.07] pt-6">{isAuthenticated && user ? <div className="space-y-1"><div className="mb-2 rounded-xl bg-[#f7f7f5] px-4 py-3"><p className="font-bold text-[#111]">{user.nickname}</p><p className="mt-0.5 truncate text-xs text-[#8a8a86]">{user.email || user.phone || '已登录'}</p></div>{accountLinks}<button type="button" onClick={handleLogout} className="flex w-full items-center rounded-xl px-3 py-3 font-bold text-red-600"><LogOut className="mr-3 h-4 w-4" />退出登录</button></div> : <div className="grid grid-cols-2 gap-3"><button type="button" onClick={() => openAuthModal('login')} className="zy-button zy-button-secondary">登录</button><button type="button" onClick={() => openAuthModal('register', '/jobs')} className="zy-button zy-button-primary">免费开始</button></div>}</div>
        </div>
      ) : null}
    </nav>
  );
}
