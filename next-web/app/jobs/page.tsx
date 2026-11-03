import type { Metadata } from "next";
import Link from "next/link";
import { JobsExplorerLive } from "@/components/jobs-explorer-live";
import { jobRegionGuides } from "@/lib/job-regions";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "应届生招聘与校招职位", description: "浏览适合大学生、应届毕业生和留学生的校招、实习与全职职位，按岗位和地区筛选机会，并进入企业官网核验和申请。", alternates: { canonical: "/jobs" } };
export default function JobsPage() {
  return <><JobsExplorerLive /><section className={styles.regions} aria-labelledby="regions-title"><div className={styles.inner}>
    <h2 id="regions-title">按地区找校招与实习</h2>
    <p>先看各地区的搜索方法，再进入实时岗位列表核对企业原始公告。</p>
    <div className={styles.grid}>{jobRegionGuides.map((region) => <Link href={`/jobs/regions/${region.slug}`} key={region.slug}><strong>{region.name}</strong><span>{region.title} →</span></Link>)}</div>
  </div></section></>;
}
