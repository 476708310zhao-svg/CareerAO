import { NextRequest, NextResponse } from "next/server";
import { jobs } from "@/lib/jobs";

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.toLowerCase();
  const region = searchParams.get("region");
  const type = searchParams.get("type");
  const result = jobs.filter((job) => (!query || `${job.title} ${job.company} ${job.skills.join(" ")}`.toLowerCase().includes(query)) && (!region || job.region === region) && (!type || job.type === type));
  return NextResponse.json({ data: result, total: result.length });
}
