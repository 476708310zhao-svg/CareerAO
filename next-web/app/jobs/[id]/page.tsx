import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { JobDetailLive, type JobDetailData } from "@/components/job-detail-live";
import { JsonLd } from "@/components/json-ld";
import { getJob, isJobIndexable, jobs, type Job } from "@/lib/jobs";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

const getLiveJob = cache(async (id: string): Promise<JobDetailData | null> => {
  const backend = (process.env.BACKEND_API_URL || "http://127.0.0.1:4400").replace(/\/$/, "");
  try {
    const response = await fetch(`${backend}/api/jobs/${encodeURIComponent(id)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    const payload = await response.json();
    return payload.code === 0 && payload.data?.id ? payload.data as JobDetailData : null;
  } catch {
    return null;
  }
});

function toJobDetailData(job: Job): JobDetailData {
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    region: job.region,
    salary: job.salary,
    jobType: job.type,
    industry: job.track,
    description: job.description,
    requirements: job.qualifications,
    tags: job.skills,
    postedAt: job.posted,
    deadline: job.deadline,
    applyUrl: job.officialUrl,
    sourceLabel: job.sourceType === "demo" ? "产品演示职位（演示数据）" : "企业公开招聘信息",
    dataMeta: {
      sourceLabel: job.sourceType === "demo" ? "产品演示职位（演示数据）" : "企业公开招聘信息",
      freshnessLabel: job.sourceType === "demo" ? "演示数据" : "已核验",
      degraded: job.sourceType === "demo",
    },
  };
}

function dateValue(value: string) {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? undefined : new Date(parsed).toISOString();
}

function employmentType(type: Job["type"]) {
  return ({
    Intern: "INTERN",
    "New Grad": "FULL_TIME",
    "Full Time": "FULL_TIME",
    Research: "FULL_TIME",
    "Co-op": "INTERN",
  } as const)[type];
}

export function generateStaticParams() {
  return jobs.map((job) => ({ id: job.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = getJob(id) || await getLiveJob(id);
  if (!job) return { title: "职位不存在", robots: { index: false, follow: false } };
  const indexable = "sourceType" in job && isJobIndexable(job);
  return {
    title: `${job.title}｜${job.company}`,
    description: `${job.company} 招聘 ${job.title}，工作地点 ${job.location}。查看岗位介绍、任职要求、申请截止日期与企业官网入口。`,
    alternates: { canonical: `/jobs/${job.id}` },
    robots: { index: indexable, follow: true },
    openGraph: {
      type: "website",
      url: `/jobs/${job.id}`,
      title: `${job.title}｜${job.company}`,
      description: `${job.company} 招聘 ${job.title}，工作地点 ${job.location}。`,
    },
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = getJob(id);
  const liveJob = job ? null : await getLiveJob(id);
  if (liveJob) return <JobDetailLive id={id} initialJob={liveJob} />;
  if (!job) notFound();

  const indexable = isJobIndexable(job);
  const jobPosting = indexable ? {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: dateValue(job.posted),
    validThrough: dateValue(job.deadline),
    employmentType: employmentType(job.type),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: job.region,
      },
    },
    url: absoluteUrl(`/jobs/${job.id}`),
    directApply: false,
  } : null;

  return <>{jobPosting && <JsonLd data={jobPosting} />}<JobDetailLive id={id} initialJob={toJobDetailData(job)} /></>;
}
