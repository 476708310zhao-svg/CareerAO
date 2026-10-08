import { NextResponse } from "next/server";
import { getJob } from "@/lib/jobs";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const job = getJob((await params).id);
  return job ? NextResponse.json({ data: job }) : NextResponse.json({ error: "Job not found" }, { status: 404 });
}
