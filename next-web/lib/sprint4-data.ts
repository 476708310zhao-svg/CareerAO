export type InterviewRound = "Recruiter Screen" | "Technical" | "Hiring Manager" | "Final";
export type InterviewQuestionType = "Behavioral" | "Algorithm" | "Role-specific" | "Company history";
export type InterviewQuestion = { id: string; type: InterviewQuestionType; question: string; frequency: "High" | "Medium"; completed: boolean };
export type InterviewSession = { id: string; workspaceId: string; startedAt: string; completedAt?: string; mode: "Mock Interview" | "STAR Practice"; status: "in_progress" | "completed" | "cancelled"; scores?: { content: number; structure: number; delivery: number; roleMatch: number }; feedback?: string[] };
export type InterviewWorkspace = { id: string; applicationId: string; company: string; role: string; interviewAt: string; round: InterviewRound; readiness: number; questions: InterviewQuestion[]; sessions: InterviewSession[]; createdAutomatically: boolean };
export type AgentKind = "job-advisor" | "application-assistant" | "interview-coach" | "career-planner";
export type AgentRun = { id: string; agent: AgentKind; prompt: string; redactedPrompt: string; status: "running" | "awaiting_confirmation" | "completed" | "failed" | "cancelled"; createdAt: string; result?: string; pendingWrite?: { label: string; action: string }; retryCount: number };
export type MembershipPlan = { id: "free" | "pro" | "career-plus"; name: string; monthlyPrice: number; benefits: string[]; limits: { aiCalls: number; resumeVersions: number; interviewSessions: number; advancedMatch: boolean } };
export type Subscription = { planId: MembershipPlan["id"]; status: "active" | "trialing" | "past_due" | "cancelled" | "expired"; currentPeriodEnd: string; orderStatus: "none" | "pending" | "paid" | "refunded"; paymentEnabled: boolean };

const interviewQuestions: InterviewQuestion[] = [
  { id: "q1", type: "Company history", question: "为什么选择 Anthropic？你如何理解 AI safety？", frequency: "High", completed: false },
  { id: "q2", type: "Behavioral", question: "Tell me about a time you disagreed with a technical decision.", frequency: "High", completed: true },
  { id: "q3", type: "Algorithm", question: "设计一个支持 TTL 的线程安全 LRU Cache。", frequency: "High", completed: false },
  { id: "q4", type: "Role-specific", question: "如何为 LLM evaluation 设计可靠的离线指标？", frequency: "High", completed: false },
  { id: "q5", type: "Role-specific", question: "解释 Transformer inference 中的 KV cache。", frequency: "Medium", completed: true },
  { id: "q6", type: "Behavioral", question: "用 STAR 结构讲述一次模糊需求下的项目经历。", frequency: "Medium", completed: false },
];
export const seedInterviewWorkspaces: InterviewWorkspace[] = [{ id: "interview-anthropic", applicationId: "app-anthropic", company: "Anthropic", role: "Machine Learning Research Intern", interviewAt: "2026-07-17T10:30:00+08:00", round: "Technical", readiness: 64, questions: interviewQuestions, createdAutomatically: true, sessions: [{ id: "session-1", workspaceId: "interview-anthropic", startedAt: "2026-07-10T14:00:00+08:00", completedAt: "2026-07-10T14:24:00+08:00", mode: "STAR Practice", status: "completed", scores: { content: 78, structure: 71, delivery: 66, roleMatch: 81 }, feedback: ["案例背景清晰，但行动部分可以更具体", "减少填充词，结论先行", "将结果与岗位所需研究能力关联"] }] }];
export const membershipPlans: MembershipPlan[] = [
  { id: "free", name: "Free", monthlyPrice: 0, benefits: ["基础岗位浏览", "每月 5 次 AI 调用", "2 份简历版本", "1 次面试训练"], limits: { aiCalls: 5, resumeVersions: 2, interviewSessions: 1, advancedMatch: false } },
  { id: "pro", name: "Pro", monthlyPrice: 19, benefits: ["高级岗位匹配", "每月 80 次 AI 调用", "20 份简历版本", "10 次面试训练"], limits: { aiCalls: 80, resumeVersions: 20, interviewSessions: 10, advancedMatch: true } },
  { id: "career-plus", name: "Career Plus", monthlyPrice: 39, benefits: ["全部 Pro 权益", "每月 200 次 AI 调用", "无限简历版本", "30 次面试训练"], limits: { aiCalls: 200, resumeVersions: -1, interviewSessions: 30, advancedMatch: true } },
];
export const seedSubscription: Subscription = { planId: "free", status: "active", currentPeriodEnd: "2026-08-01T00:00:00+08:00", orderStatus: "none", paymentEnabled: false };
export const SPRINT4_STORE_KEY = "zhiyin-career-sprint4";
