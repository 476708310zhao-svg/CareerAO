import { NextResponse } from "next/server";
import { getJob } from "@/lib/jobs";
import { toPublicJob } from "@/lib/public-jobs";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const job = getJob((await params).id);
  return job
    ? NextResponse.json({ code: 0, data: toPublicJob(job) })
    : NextResponse.json({ code: -1, message: "Job not found" }, { status: 404 });
}
