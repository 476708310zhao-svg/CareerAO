import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  if (!Array.isArray(body.content) || body.content.length === 0) return NextResponse.json({ error: "Resume content is required" }, { status: 400 });
  const skill = body.job?.skills?.[0];
  const suggestions = body.content.slice(0, 3).map((original: string, index: number) => {
    const transformed = index === 0 ? `${original.replace(/^(Built|Developed)/, "Designed and built")}${skill && !original.toLowerCase().includes(skill.toLowerCase()) ? `, applying ${skill} where supported by the project` : ""}` : index === 1 ? original.replace(/^Collaborated/, "Partnered cross-functionally").replace(/^Designed/, "Designed and documented") : original;
    return { id: `suggestion-${index + 1}`, original, suggested: transformed, reason: index === 0 ? "强化动作与岗位关键词，同时不添加未经证实的成果数据。" : index === 1 ? "提升表达清晰度，让协作方式和产出更容易被招聘方识别。" : "保持事实不变，建议将这一条移动到与目标岗位更相关的位置。", status: "pending", safe: true };
  });
  return NextResponse.json({ suggestions, model: "zhiyin-resume-1.2", promptVersion: "resume-opt-v3", policy: "source-grounded-no-overwrite" });
}
