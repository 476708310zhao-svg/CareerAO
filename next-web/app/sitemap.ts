import type { MetadataRoute } from "next";
import { isJobIndexable, jobs } from "@/lib/jobs";
import { jobRegionGuides } from "@/lib/job-regions";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  const now = new Date();
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/jobs`, changeFrequency: "daily", priority: 0.9 },
    ...jobRegionGuides.map((region) => ({ url: `${base}/jobs/regions/${region.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${base}/application-assistant`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/job-map`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/salary-insights`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/agency-evaluation`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/campus-calendar`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/news`, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/visa-policies`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/interview-experiences`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/interview-prep`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/help-center`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/team`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.3 },
    ...jobs.filter((job) => isJobIndexable(job, now)).map((job) => ({ url: `${base}/jobs/${job.id}`, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
