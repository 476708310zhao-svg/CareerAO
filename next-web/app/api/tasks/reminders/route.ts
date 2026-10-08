import { NextResponse } from "next/server";
import type { ReminderSettings, TodayTask } from "@/lib/career-data";

export async function POST(request: Request) {
  const { settings, tasks } = await request.json() as { settings: ReminderSettings; tasks: TodayTask[] };
  if (!settings || !Array.isArray(tasks)) return NextResponse.json({ error: "Reminder settings and tasks are required" }, { status: 400 });
  if (!settings.enabled) return NextResponse.json({ scheduled: [], skipped: "disabled" });
  const windowKey = new Date().toISOString().slice(0, 10) + `:${settings.frequency}`;
  const eligible = tasks.filter((task) => task.status === "todo" && (settings.frequency !== "important" || task.priority === "high"));
  const scheduled = eligible.flatMap((task) => { const dedupeKey = `${task.id}:${task.dueAt.slice(0, 10)}:${windowKey}`; return settings.lastSentKeys.includes(dedupeKey) ? [] : [{ taskId: task.id, title: task.title, dueAt: task.dueAt, dedupeKey, channel: "wechat_subscription", status: "pending_wechat_credentials" }]; });
  return NextResponse.json({ scheduled, deduplicated: eligible.length - scheduled.length, frequency: settings.frequency, adapter: "wechat-subscribe-message-v1" });
}
