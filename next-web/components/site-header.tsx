"use client";

import Link from "next/link";
import Image from "next/image";
import { BriefcaseBusiness, ChevronDown, FileText, Menu, Search, Sparkles, UserRound } from "lucide-react";
import { useAuth } from "./auth-provider";
import { publicAsset } from "@/lib/base-path";

const toolColumns = [
  { title: "准备", items: [
    { label: "简历优化", href: "/resume", description: "管理简历版本与岗位匹配" },
    { label: "求职规划", href: "/today", description: "把目标拆成今天的行动" },
    { label: "网申助手", href: "/application-assistant", description: "准备申请材料与开放题" },
  ] },
  { title: "面试", items: [
    { label: "AI 模拟面试", href: "/interviews", description: "按岗位练习并复盘表达" },
    { label: "笔经面经", href: "/interview-experiences", description: "查看流程、题型与准备重点" },
  ] },
  { title: "决策", items: [
    { label: "求职地图", href: "/job-map", description: "按地区浏览职位机会" },
    { label: "薪资查询", href: "/salary-insights", description: "了解岗位与地区薪资信息" },
    { label: "机构测评", href: "/agency-evaluation", description: "核对服务内容与适用边界" },
  ] },
];

const resources = [
  { label: "校招日历", href: "/campus-calendar", description: "掌握申请开放与截止时间" },
  { label: "求职资讯", href: "/news", description: "近期校招与行业动态" },
  { label: "求职攻略", href: "/blog", description: "从投递到 Offer 的实用方法" },
  { label: "签证政策", href: "/visa-policies", description: "留学生身份与工作签证信息" },
];

export function SiteHeader() {
  const { ready, token, user, logout } = useAuth();
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label="职引 Career 首页"><span className="brand-mark" aria-hidden="true"><Image src={publicAsset("/brand-logo.png")} alt="" width={38} height={38} priority /></span><span>职引 <b>Career</b></span></Link>
        <nav className="desktop-nav zy-main-nav" aria-label="主导航">
          <Link href="/jobs">找工作</Link>
          <div className="zy-nav-menu">
            <button type="button" aria-haspopup="true">求职工具 <ChevronDown size={14} aria-hidden="true" /></button>
            <div className="zy-mega-menu zy-tools-menu">
              {toolColumns.map((column) => <section key={column.title}><span>{column.title}</span>{column.items.map((item) => <Link key={item.label} href={item.href}><b>{item.label}</b><small>{item.description}</small></Link>)}</section>)}
            </div>
          </div>
          <div className="zy-nav-menu">
            <button type="button" aria-haspopup="true">资源 <ChevronDown size={14} aria-hidden="true" /></button>
            <div className="zy-mega-menu zy-resources-menu">
              {resources.map((item) => <Link key={item.label} href={item.href}><b>{item.label}</b><small>{item.description}</small></Link>)}
            </div>
          </div>
        </nav>
        <div className="header-actions">
          {ready && token ? <><Link href="/today" className="login-link">{user?.nickname || "工作台"}</Link><button type="button" className="zy-header-logout" onClick={logout}>退出</button></> : <Link href="/login" className="login-link">登录</Link>}
          <Link href={token ? "/today" : "/register"} className="button button-dark button-small">{token ? "进入工作台" : "免费开始"}</Link>
          <details className="zy-mobile-menu">
            <summary aria-label="打开导航菜单"><Menu size={22} /></summary>
            <nav aria-label="移动端导航">
              <Link href="/jobs"><Search size={16} />找工作</Link>
              <Link href="/today"><BriefcaseBusiness size={16} />求职工作台</Link>
              <Link href="/resume"><FileText size={16} />简历优化</Link>
              <Link href="/application-assistant"><Sparkles size={16} />网申助手</Link>
              <Link href="/profile"><UserRound size={16} />我的职业画像</Link>
              <span>数据与决策</span>
              <Link href="/job-map">求职地图</Link>
              <Link href="/salary-insights">薪资查询</Link>
              <Link href="/agency-evaluation">机构测评</Link>
              <span>资源</span>
              {resources.map((item) => <Link key={item.label} href={item.href}>{item.label}</Link>)}
              {token ? <button type="button" onClick={logout}>退出登录</button> : <Link href="/login">登录工作台</Link>}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
