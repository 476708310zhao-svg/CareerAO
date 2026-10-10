import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { publicAsset } from "@/lib/base-path";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Check,
  FileText,
  Fingerprint,
  LayoutDashboard,
  LockKeyhole,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";
import "./preview.css";

export const metadata: Metadata = {
  title: "职引官网预览｜求职路径更清楚",
  description:
    "职引用一份 Career Profile 串起找岗位、简历准备、投递跟进和面试训练。",
  robots: { index: false, follow: false },
};

const workflow = [
  {
    title: "先判断机会",
    text: "结合目标方向、身份信息和岗位要求，先回答“值不值得申请”。",
    href: "/jobs",
    link: "查看职位中心",
  },
  {
    title: "再准备材料",
    text: "围绕具体岗位维护 Resume 版本，并准备 Cover Letter 与沟通材料。",
    href: "/resume",
    link: "查看简历中心",
  },
  {
    title: "持续管理进度",
    text: "把收藏、准备、已投递、面试与 Offer 状态留在同一段申请记录里。",
    href: "/applications",
    link: "查看申请管理",
  },
  {
    title: "把反馈变成下一步",
    text: "通过 Today 与 AI Career 汇总待办、短板和下一次训练行动。",
    href: "/today",
    link: "查看今日工作台",
  },
];

const productProof = [
  {
    icon: LayoutDashboard,
    name: "Today",
    summary: "把分散的求职任务整理成今天可以完成的优先事项。",
    href: "/today",
  },
  {
    icon: Search,
    name: "Jobs",
    summary: "按方向、地区、职位类型和签证相关信息筛选岗位。",
    href: "/jobs",
  },
  {
    icon: FileText,
    name: "Resume",
    summary: "维护不同方向的简历版本与针对岗位的优化记录。",
    href: "/resume",
  },
  {
    icon: Sparkles,
    name: "AI Career",
    summary: "在同一职业上下文中调用岗位、申请、面试与规划 Agent。",
    href: "/ai-career",
  },
];

export default function PreviewPage() {
  return (
    <div className="preview-site">
      <a className="pv-skip" href="#main-content">跳到主要内容</a>

      <main id="main-content">
        <section className="pv-hero">
          <div className="pv-shell pv-hero-grid">
            <div className="pv-hero-copy">
              <h1>
                <span>求职路径更清楚</span>
                <span className="pv-title-accent">每一步更好执行</span>
              </h1>
              <p className="pv-hero-lead">
                从找岗位、改简历到投递跟进和面试训练，
                用一份 Career Profile 串起全过程。
              </p>
              <div className="pv-hero-actions">
                <Link href="/profile" className="pv-button pv-button-primary">
                  免费建立 Career Profile <ArrowRight size={17} aria-hidden="true" />
                </Link>
                <a href="#proof" className="pv-button pv-button-outline">
                  查看真实产品入口
                </a>
              </div>
              <div className="pv-honesty-note">
                <BadgeCheck size={18} aria-hidden="true" />
                <p><b>真实入口，可直接体验。</b> 界面示例均标注为演示数据。</p>
              </div>
            </div>

            <figure className="pv-hero-visual">
              <Image
                src={publicAsset("/hero-product-overview.png")}
                alt="职引产品功能总览，展示智能找岗、AI 简历优化、模拟面试、申请进度追踪、面经题库和薪资洞察"
                width={1672}
                height={941}
                sizes="(max-width: 820px) calc(100vw - 40px), (max-width: 1280px) 54vw, 690px"
                priority
              />
              <figcaption>产品界面演示 · 图中数量为演示数据</figcaption>
            </figure>
          </div>
        </section>

        <section className="pv-problem">
          <div className="pv-shell pv-problem-grid">
            <div>
              <h2>求职难，难在<span className="pv-title-accent">下一步</span>不清楚。</h2>
              <p>机会判断、材料版本、身份限制和面试准备分散在不同地方，下一步自然变得模糊。</p>
            </div>
            <div className="pv-change-list">
              <article>
                <span>从</span><b>收藏很多岗位，却不知道先投哪一个</b>
                <ArrowRight size={18} aria-hidden="true" />
                <strong>先判断匹配与申请优先级</strong>
              </article>
              <article>
                <span>从</span><b>每次申请都重新找材料和改 Resume</b>
                <ArrowRight size={18} aria-hidden="true" />
                <strong>让岗位、版本与申请记录保持关联</strong>
              </article>
              <article>
                <span>从</span><b>只在面试前临时准备</b>
                <ArrowRight size={18} aria-hidden="true" />
                <strong>把反馈持续转成训练任务</strong>
              </article>
            </div>
          </div>
        </section>

        <section id="workflow" className="pv-workflow">
          <div className="pv-shell">
            <div className="pv-section-heading">
              <h2><span className="pv-title-accent">一份画像</span>，贯穿求职全程。</h2>
              <p>每个工具都围绕同一份目标、经历、申请记录和待办工作，而不是让你重复提供背景。</p>
            </div>
            <div className="pv-workflow-grid">
              <ol className="pv-workflow-list">
                {workflow.map((item) => (
                  <li key={item.title}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                    <Link href={item.href}>{item.link} <ArrowRight size={15} aria-hidden="true" /></Link>
                  </li>
                ))}
              </ol>
              <aside className="pv-profile-sheet" aria-label="Career Profile 关联信息示例">
                <div className="pv-sheet-head">
                  <UserRound size={22} aria-hidden="true" />
                  <span><b>Career Profile</b><small>演示信息</small></span>
                </div>
                <dl>
                  <div><dt>目标方向</dt><dd>AI Engineer · SDE</dd></div>
                  <div><dt>求职阶段</dt><dd>New Grad</dd></div>
                  <div><dt>身份信息</dt><dd>由用户确认后使用</dd></div>
                  <div><dt>经历素材</dt><dd>Education · Projects · Skills</dd></div>
                </dl>
                <div className="pv-sheet-result">
                  <Check size={17} aria-hidden="true" />
                  <p><b>一次维护，多处引用</b><br />岗位分析、材料准备和 Agent 建议共享已确认的上下文。</p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section id="proof" className="pv-proof">
          <div className="pv-shell">
            <div className="pv-proof-heading">
              <h2>真实产品，<span className="pv-title-accent">直接打开看。</span></h2>
              <p>下面不是客户评价或概念图，而是当前项目中已经存在的产品页面。</p>
            </div>
            <div className="pv-proof-links">
              {productProof.map(({ icon: Icon, ...item }) => (
                <Link href={item.href} key={item.name}>
                  <Icon size={24} aria-hidden="true" />
                  <span><b>{item.name}</b><small>{item.summary}</small></span>
                  <span className="pv-proof-open">打开产品 <ArrowRight size={16} aria-hidden="true" /></span>
                </Link>
              ))}
            </div>
            <p className="pv-proof-footnote">
              <ShieldCheck size={15} aria-hidden="true" /> 本页可视化界面使用演示数据；登录后的工作台读取本人真实记录，职位页读取后端职位数据源。
            </p>
          </div>
        </section>

        <section id="scenarios" className="pv-scenarios">
          <div className="pv-shell">
            <div className="pv-section-heading pv-heading-narrow">
              <h2>不同阶段，<span className="pv-title-accent">专注当下。</span></h2>
            </div>
            <div className="pv-scenario-layout">
              <article className="pv-scenario-primary">
                <div>
                  <span className="pv-scenario-icon"><BriefcaseBusiness size={22} aria-hidden="true" /></span>
                  <h3>正在集中投递</h3>
                  <p>需要同时判断岗位、准备多版 Resume、记录截止时间，并跟进已经发出的申请。</p>
                </div>
                <ul>
                  <li><Check aria-hidden="true" />按身份与方向筛选机会</li>
                  <li><Check aria-hidden="true" />为具体岗位关联简历版本</li>
                  <li><Check aria-hidden="true" />集中查看申请状态和下一步</li>
                </ul>
              </article>
              <article className="pv-scenario-secondary">
                <span className="pv-scenario-icon"><MessageSquareText size={22} aria-hidden="true" /></span>
                <div>
                  <h3>进入面试阶段</h3>
                  <p>把岗位要求、经历素材与历史反馈放在一起，形成连续训练计划。</p>
                  <Link href="/interviews">查看面试中心 <ArrowRight size={15} aria-hidden="true" /></Link>
                </div>
              </article>
              <article className="pv-scenario-tertiary">
                <span className="pv-scenario-icon"><Target size={22} aria-hidden="true" /></span>
                <div>
                  <h3>还在确定方向</h3>
                  <p>先建立 Career Profile，再通过职位与行动反馈逐步收窄目标。</p>
                  <Link href="/profile">开始建立画像 <ArrowRight size={15} aria-hidden="true" /></Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="pv-onboarding">
          <div className="pv-shell pv-onboarding-grid">
            <div>
              <h2><span className="pv-title-accent">三步</span>开始行动。</h2>
              <p>先用已有信息建立基础，再在真实申请过程中逐步补全。</p>
            </div>
            <ol>
              <li><span>1</span><div><b>建立 Career Profile</b><small>确认目标方向、教育经历、技能与身份相关信息。</small></div></li>
              <li><span>2</span><div><b>选择目标岗位</b><small>查看岗位要求、签证标签与申请材料准备项。</small></div></li>
              <li><span>3</span><div><b>按优先级执行</b><small>通过 Today、Applications 与 AI Career 持续推进。</small></div></li>
            </ol>
          </div>
        </section>

        <section id="trust" className="pv-trust">
          <div className="pv-shell">
            <div className="pv-trust-head">
              <h2>AI 提建议，<span className="pv-title-accent">决定权在你。</span></h2>
              <p>产品把可控性放在流程里，而不是写在一句笼统的安全承诺里。</p>
            </div>
            <div className="pv-boundaries">
              <article>
                <LockKeyhole size={23} aria-hidden="true" />
                <h3>敏感信息先脱敏</h3>
                <p>AI Career 在发送前处理邮箱、手机号与证件号等敏感字段。</p>
              </article>
              <article>
                <Fingerprint size={23} aria-hidden="true" />
                <h3>写操作需要确认</h3>
                <p>Agent 建议写入任务或记录时，先向用户展示动作并等待确认。</p>
              </article>
              <article>
                <ShieldCheck size={23} aria-hidden="true" />
                <h3>保留专业边界</h3>
                <p>岗位、签证与申请要求应以企业、学校和相关官方渠道为准。</p>
              </article>
            </div>
            <div className="pv-trust-source">
              <BookOpen size={21} aria-hidden="true" />
              <div><b>信息如何验证</b><p>职位详情保留官方招聘入口；演示内容明确标注；尚未提供的客户案例、评价和成果数据不在本页展示。</p></div>
              <Link href="/jobs">查看职位来源 <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
          </div>
        </section>

        <section className="pv-final-cta">
          <div className="pv-shell pv-final-grid">
            <div>
              <h2>看清下一步，<span className="pv-title-accent">开始行动。</span></h2>
              <p>建立你的 Career Profile，让岗位、材料、申请和训练围绕同一份职业上下文工作。</p>
            </div>
            <div>
              <Link href="/profile" className="pv-button pv-button-light">
                免费建立 Career Profile <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <small>本预览页中的界面示例均为演示数据；登录后功能使用后端真实记录。</small>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
