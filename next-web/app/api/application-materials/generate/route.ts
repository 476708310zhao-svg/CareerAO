import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.type || !body.job || !Array.isArray(body.verifiedExperience)) return NextResponse.json({ error: "Missing verified application context" }, { status: 400 });
  const [first = "", second = ""] = body.verifiedExperience;
  const company = body.job.company; const title = body.job.title;
  const contentByType: Record<string, string> = {
    "Tailored Resume": `TARGET ROLE — ${title} at ${company}\n\nRELEVANT EXPERIENCE\n• ${first}\n• ${second}\n\nCORE SKILLS\n${(body.job.skills || []).join(" · ")}\n\nNote: This draft only reorganizes verified resume content. Review every line before saving.`,
    "Cover Letter": `Dear ${company} Hiring Team,\n\nI am writing to express my interest in the ${title} position. My background includes ${first.charAt(0).toLowerCase() + first.slice(1)}. I have also ${second.charAt(0).toLowerCase() + second.slice(1)}.\n\nThese experiences have prepared me to contribute thoughtfully to the role while continuing to grow alongside your team. I would welcome the opportunity to discuss how my verified experience aligns with ${company}'s needs.\n\nSincerely,\nAlex Chen`,
    "Recruiter Message": `Hi — I’m interested in the ${title} role at ${company}. My relevant experience includes ${first.charAt(0).toLowerCase() + first.slice(1)}. I’d appreciate the chance to learn more about the team and share how my background may fit. Thank you for your time.`,
    "Follow-up Email": `Subject: Following up — ${title} application\n\nHello ${company} Recruiting Team,\n\nI’m following up on my application for the ${title} role. I remain very interested in the opportunity, particularly given my experience with ${first.charAt(0).toLowerCase() + first.slice(1)}.\n\nPlease let me know if I can provide any additional information. Thank you for your consideration.\n\nBest,\nAlex Chen`,
  };
  return NextResponse.json({ content: contentByType[body.type], model: "zhiyin-application-1.1", promptVersion: "application-material-v2", groundedIn: "verifiedExperience" });
}
