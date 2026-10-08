import { Job, jobs } from "@/lib/jobs";

const regionLabels: Record<Job["region"], string> = {
  USA: "美国",
  Canada: "加拿大",
  UK: "英国",
  Singapore: "新加坡",
};

const typeLabels: Record<Job["type"], string> = {
  Intern: "实习",
  "New Grad": "应届生",
  "Full Time": "全职",
  Research: "研究",
  "Co-op": "校企合作",
};

export const demoJobMeta = {
  sourceLabel: "产品演示职位（演示数据）",
  freshnessLabel: "演示数据",
  degraded: true,
};

export function toPublicJob(job: Job) {
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    region: regionLabels[job.region],
    salary: job.salary,
    jobType: typeLabels[job.type],
    industry: job.track,
    description: job.description,
    requirements: job.qualifications,
    tags: job.skills,
    postedAt: job.posted,
    deadline: job.deadline,
    applyUrl: job.officialUrl,
    sourceLabel: demoJobMeta.sourceLabel,
    dataMeta: demoJobMeta,
  };
}

export function publicDemoJobs() {
  return jobs.map(toPublicJob);
}

