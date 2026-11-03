import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { jobRegionGuides, jobSearchHref } from "@/lib/job-regions";
import styles from "./region.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return jobRegionGuides.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const region = jobRegionGuides.find((item) => item.slug === slug);
  if (!region) return { title: "地区不存在", robots: { index: false, follow: false } };
  return {
    title: region.title,
    description: region.description,
    alternates: { canonical: `/jobs/regions/${region.slug}` },
  };
}

export default async function JobRegionPage({ params }: Props) {
  const { slug } = await params;
  const region = jobRegionGuides.find((item) => item.slug === slug);
  if (!region) notFound();

  return <main className={styles.page}>
    <div className={styles.container}>
      <nav className={styles.breadcrumb} aria-label="面包屑导航"><Link href="/jobs">职位搜索</Link><span aria-hidden="true">/</span><span>{region.name}</span></nav>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>按地区找机会 · {region.name}</span>
        <h1>{region.title}</h1>
        <p>{region.description}</p>
        <Link className={styles.primary} href={jobSearchHref(region)}>查看{region.name}岗位 →</Link>
      </header>
      <div className={styles.grid}>
        <article className={styles.main}>
          <h2>先从真实岗位要求开始</h2>
          <p>{region.focus}</p>
          <h2>三步筛选</h2>
          <ol>{region.steps.map((step) => <li key={step.title}><h3>{step.title}</h3><p>{step.detail}</p></li>)}</ol>
          <h2>常用搜索词</h2>
          <div className={styles.searches}>{region.searches.map((keyword) => <Link key={keyword} href={jobSearchHref(region, keyword)}>{region.name} · {keyword} →</Link>)}</div>
          <p className={styles.note}>岗位数量和开放状态会变化。这里的搜索入口只带入地区与关键词；具体资格、薪资和截止时间请回到企业原始公告核对。</p>
        </article>
        <aside className={styles.sidebar} aria-label="更多求职入口">
          <h2>继续准备</h2>
          <Link href="/campus-calendar">查看校招日历 →</Link>
          <Link href="/blog">阅读求职准备指南 →</Link>
          <Link href="/job-map">浏览地区机会地图 →</Link>
          <h2>其他地区</h2>
          {jobRegionGuides.filter((item) => item.slug !== region.slug).map((item) => <Link key={item.slug} href={`/jobs/regions/${item.slug}`}>{item.name} →</Link>)}
        </aside>
      </div>
    </div>
  </main>;
}
