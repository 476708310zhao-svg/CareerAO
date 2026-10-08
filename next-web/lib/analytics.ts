export type AnalyticsEvent =
  | "homepage_view"
  | "register_click"
  | "job_view"
  | "job_save"
  | "application_create"
  | "resume_generate"
  | "resume_suggestion_review"
  | "resume_version_restore"
  | "application_material_save"
  | "today_view"
  | "task_create"
  | "task_complete"
  | "task_skip"
  | "task_postpone"
  | "reminder_settings_update"
  | "profile_start"
  | "profile_complete"
  | "job_match_view"
  | "official_apply_click"
  | "application_status_change"
  | "interview_training_start"
  | "interview_training_complete"
  | "membership_view"
  | "membership_purchase"
  | "agent_run_start"
  | "agent_run_complete"
  | "agent_write_confirm"
  | "ai_analysis"
  | "interview_start"
  | "pricing_click"
  | "subscription_success";

export function track(event: AnalyticsEvent, properties: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const payload = { event, ...properties, timestamp: new Date().toISOString() };
  const dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer;
  dataLayer?.push(payload);
  try {
    const previous = JSON.parse(localStorage.getItem("zhiyin-analytics-events") || "[]") as unknown[];
    localStorage.setItem("zhiyin-analytics-events", JSON.stringify([...previous.slice(-499), { id: crypto.randomUUID(), ...payload }]));
  } catch { /* analytics must never block the product flow */ }
  window.dispatchEvent(new CustomEvent("zhiyin:analytics", { detail: payload }));
}
