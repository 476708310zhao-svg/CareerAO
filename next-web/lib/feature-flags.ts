export const featureFlags = {
  v4Today: process.env.NEXT_PUBLIC_FF_V4_TODAY !== "false",
  interviewWorkspace: process.env.NEXT_PUBLIC_FF_INTERVIEW_WORKSPACE !== "false",
  aiCareerAgents: process.env.NEXT_PUBLIC_FF_AI_CAREER_AGENTS !== "false",
  membership: process.env.NEXT_PUBLIC_FF_MEMBERSHIP !== "false",
  wechatPayment: false,
  rolloutPercentage: Number(process.env.NEXT_PUBLIC_V4_ROLLOUT_PERCENTAGE || 5),
} as const;

export function isRolloutEnabled(userId: string, percentage = featureFlags.rolloutPercentage) {
  const bucket = [...userId].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) % 100, 0);
  return bucket < percentage;
}
