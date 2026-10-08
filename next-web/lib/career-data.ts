export type ResumeKind = "SDE Resume" | "AI Engineer Resume" | "Data Resume" | "Quant Resume" | "General Resume";
export type ExperienceCategory = "Education" | "Experience" | "Projects" | "Skills" | "Awards";
export type ResumeStatus = "active" | "archived";
export type ExperienceItem = { id: string; category: ExperienceCategory; title: string; organization: string; period?: string; bullets: string[] };
export type ResumeVersion = { id: string; label: string; createdAt: string; source: "manual" | "ai" | "restore"; content: string[]; aiModel?: string; promptVersion?: string; note: string };
export type ResumeRecord = { id: string; name: string; kind: ResumeKind; status: ResumeStatus; isDefault: boolean; updatedAt: string; targetJobId?: string; applicationId?: string; atsScore: number; optimizationCount: number; currentVersionId: string; versions: ResumeVersion[] };
export type ApplicationMaterialType = "Tailored Resume" | "Cover Letter" | "Recruiter Message" | "Follow-up Email";
export type SavedMaterial = { id: string; applicationId: string; type: ApplicationMaterialType; content: string; createdAt: string; model: string; promptVersion: string };
export type TaskStatus = "todo" | "completed" | "skipped";
export type TaskPriority = "high" | "medium" | "low";
export type TodayTask = { id: string; title: string; description: string; status: TaskStatus; priority: TaskPriority; dueAt: string; source: "automatic" | "manual"; applicationId?: string; actionType: "job" | "resume" | "interview" | "application" | "profile"; actionHref: string; completedAt?: string; skippedAt?: string; postponedCount: number };
export type ReminderSettings = { enabled: boolean; frequency: "important" | "daily" | "twice_daily"; morningTime: string; eveningTime: string; quietHoursStart: string; quietHoursEnd: string; lastSentKeys: string[] };
export type CareerStore = { resumes: ResumeRecord[]; experiences: ExperienceItem[]; materials: SavedMaterial[]; quota: { plan: "Free" | "Pro"; used: number; limit: number; resetAt: string }; tasks: TodayTask[]; reminderSettings: ReminderSettings; weeklyApplicationGoal: number; profileCompleteness: number };

export const resumeKinds: ResumeKind[] = ["SDE Resume", "AI Engineer Resume", "Data Resume", "Quant Resume", "General Resume"];
export const seedExperiences: ExperienceItem[] = [
  { id: "edu-1", category: "Education", title: "M.S. in Computer Science", organization: "Carnegie Mellon University", period: "2025–2027", bullets: ["Coursework: Machine Learning, Distributed Systems, Natural Language Processing"] },
  { id: "exp-1", category: "Experience", title: "Software Engineering Intern", organization: "Acme Cloud", period: "May 2026–Aug 2026", bullets: ["Built internal API services in Python and reduced repeated manual workflows", "Collaborated with product and platform engineers to ship monitored production features"] },
  { id: "project-1", category: "Projects", title: "LLM Career Assistant", organization: "Independent Project", period: "2026", bullets: ["Developed a retrieval-augmented assistant using Python, FastAPI, and vector search", "Designed evaluation cases to compare answer relevance across prompt iterations"] },
  { id: "skills-1", category: "Skills", title: "Technical Skills", organization: "", bullets: ["Python, TypeScript, Java, SQL", "PyTorch, FastAPI, React, PostgreSQL, AWS"] },
  { id: "award-1", category: "Awards", title: "Dean’s List", organization: "Carnegie Mellon University", period: "2025", bullets: ["Recognized for academic performance"] },
];
const baseContent = seedExperiences.flatMap((item) => item.bullets);
const version = (id: string, label: string, daysAgo: number): ResumeVersion => ({ id, label, createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(), source: "manual", content: baseContent, note: "Created from Career Profile experience library" });
export const seedResumes: ResumeRecord[] = [
  { id: "resume-sde", name: "SDE New Grad · Main", kind: "SDE Resume", status: "active", isDefault: true, updatedAt: new Date().toISOString(), targetJobId: "stripe-software-engineer-intern", applicationId: "app-stripe", atsScore: 86, optimizationCount: 2, currentVersionId: "sde-v2", versions: [version("sde-v1", "Version 1", 18), { ...version("sde-v2", "Version 2", 4), source: "ai", aiModel: "zhiyin-resume-1.2", promptVersion: "resume-opt-v3", note: "Accepted 2 of 3 AI suggestions" }] },
  { id: "resume-ai", name: "AI Engineer · Research Focus", kind: "AI Engineer Resume", status: "active", isDefault: false, updatedAt: new Date(Date.now() - 86400000).toISOString(), targetJobId: "nvidia-ai-engineer-new-grad", atsScore: 82, optimizationCount: 1, currentVersionId: "ai-v1", versions: [version("ai-v1", "Version 1", 9)] },
  { id: "resume-data", name: "Data Science · General", kind: "Data Resume", status: "active", isDefault: false, updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(), atsScore: 78, optimizationCount: 0, currentVersionId: "data-v1", versions: [version("data-v1", "Version 1", 12)] },
];
const today = new Date();
const due = (hour: number, addDays = 0) => { const value = new Date(today); value.setDate(value.getDate() + addDays); value.setHours(hour, 0, 0, 0); return value.toISOString(); };
export const seedTasks: TodayTask[] = [
  { id: "task-nvidia-resume", title: "为 NVIDIA 岗位定制简历", description: "申请处于 Preparing 阶段，先完成岗位关键词与项目经历匹配。", status: "todo", priority: "high", dueAt: due(18), source: "automatic", applicationId: "app-nvidia", actionType: "resume", actionHref: "/resume/resume-ai", postponedCount: 0 },
  { id: "task-stripe-followup", title: "跟进 Stripe 申请", description: "已投递超过 5 天，准备一封简洁的 Follow-up 邮件。", status: "todo", priority: "medium", dueAt: due(20), source: "automatic", applicationId: "app-stripe", actionType: "application", actionHref: "/application-assistant", postponedCount: 0 },
  { id: "task-profile-visa", title: "补充 Visa Status", description: "完善身份信息后，Sponsor 岗位推荐会更准确。", status: "todo", priority: "medium", dueAt: due(12, 1), source: "automatic", actionType: "profile", actionHref: "/profile", postponedCount: 0 },
  { id: "task-shopify-review", title: "评估 Shopify Data Scientist", description: "该收藏岗位即将截止，确认是否进入申请准备。", status: "todo", priority: "low", dueAt: due(17, 2), source: "automatic", applicationId: "app-shopify", actionType: "job", actionHref: "/jobs/shopify-data-scientist", postponedCount: 0 },
];
export const seedStore: CareerStore = { resumes: seedResumes, experiences: seedExperiences, materials: [], quota: { plan: "Free", used: 2, limit: 5, resetAt: "2026-08-01" }, tasks: seedTasks, reminderSettings: { enabled: false, frequency: "important", morningTime: "09:00", eveningTime: "18:00", quietHoursStart: "22:00", quietHoursEnd: "08:00", lastSentKeys: [] }, weeklyApplicationGoal: 8, profileCompleteness: 72 };
export const applications = [
  { id: "app-nvidia", company: "NVIDIA", role: "AI Engineer — New Grad", jobId: "nvidia-ai-engineer-new-grad", status: "Preparing" },
  { id: "app-stripe", company: "Stripe", role: "Software Engineer Intern", jobId: "stripe-software-engineer-intern", status: "Applied" },
  { id: "app-shopify", company: "Shopify", role: "Data Scientist", jobId: "shopify-data-scientist", status: "Interested" },
  { id: "app-anthropic", company: "Anthropic", role: "Machine Learning Research Intern", jobId: "anthropic-ml-research-intern", status: "Interview" },
  { id: "app-tesla", company: "Tesla", role: "Hardware Engineer Co-op", jobId: "tesla-hardware-engineer-coop", status: "Offer" },
];
export const CAREER_STORE_KEY = "zhiyin-career-sprint2";
