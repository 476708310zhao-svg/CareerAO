import Link from "next/link";
import Image from "next/image";
import { publicAsset } from "@/lib/base-path";

const groups = [
  { title: "找工作", links: [["职位搜索", "/jobs"], ["求职地图", "/job-map"], ["薪资查询", "/salary-insights"], ["校招日历", "/campus-calendar"]] },
  { title: "面试备考", links: [["笔经面经", "/interview-experiences"], ["大厂面经库", "/interview-prep"], ["AI 面试", "/interviews"], ["机构测评", "/agency-evaluation"]] },
  { title: "求职工具", links: [["网申助手", "/application-assistant"], ["我的简历", "/resume"], ["求职规划", "/today"]] },
  { title: "资源中心", links: [["求职干货博客", "/blog"], ["求职资讯", "/news"], ["大厂面经库", "/interview-prep"], ["签证政策解读", "/visa-policies"], ["帮助中心", "/help-center"]] },
  { title: "关于我们", links: [["团队介绍", "/team"], ["联系我们", "/contact"], ["隐私政策", "/privacy"], ["服务条款", "/terms"]] },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell zy-footer-grid">
        <div className="zy-footer-brand">
          <Link href="/" className="brand brand-light"><span className="brand-mark" aria-hidden="true"><Image src={publicAsset("/brand-logo.png")} alt="" width={38} height={38} /></span><span>职引 <b>Career</b></span></Link>
          <p>让大学生求职过程更清晰：找到机会，做好准备，走向下一步。</p>
          <i aria-hidden="true" />
        </div>
        {groups.map((group) => <div className="zy-footer-group" key={group.title}><h3>{group.title}</h3>{group.links.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}</div>)}
        <div className="zy-footer-wechat">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={publicAsset("/wechat-qr.jpg")} alt="职引微信咨询二维码" width="112" height="112" />
          <b>微信咨询</b><span>获取求职建议与产品帮助</span>
        </div>
      </div>
      <div className="shell footer-bottom"><span>© 2026 职引 Career. All rights reserved.</span><a href="https://beian.miit.gov.cn" target="_blank" rel="noreferrer">蜀ICP备2026003605号</a></div>
    </footer>
  );
}
