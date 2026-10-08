import { NextRequest, NextResponse } from "next/server";
import { demoJobMeta, publicDemoJobs } from "@/lib/public-jobs";

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = (searchParams.get("q") || searchParams.get("keyword"))?.toLowerCase();
  const region = searchParams.get("region");
  const type = searchParams.get("type") || searchParams.get("jobType");
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize")) || 20));
  const filtered = publicDemoJobs().filter((job) =>
    (!query || `${job.title} ${job.company} ${job.tags.join(" ")}`.toLowerCase().includes(query)) &&
    (!region || region === "全部地区" || job.region === region) &&
    (!type || job.jobType === type)
  );
  const start = (page - 1) * pageSize;
  return NextResponse.json({
    code: 0,
    message: "success",
    data: {
      list: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
      source: "demo_fallback",
      dataMeta: demoJobMeta,
    },
  });
}
