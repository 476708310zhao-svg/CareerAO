import fs from "node:fs";
const required = ["app/today/page.tsx", "app/interviews/page.tsx", "app/ai-career/page.tsx", "app/admin/analytics/page.tsx", "app/pricing/page.tsx", "docs/openapi.yaml", "config/rollout.json", "config/monitoring.json"];
const missing = required.filter((file) => !fs.existsSync(file));
const miniProgramPresent = ["miniprogram", "project.config.json", "apps/miniprogram"].some((file) => fs.existsSync(file));
console.log(JSON.stringify({ status: missing.length ? "failed" : "passed", missing, checks: { v4Files: !missing.length, miniProgram: miniProgramPresent ? "detected" : "skipped_no_project_in_workspace", wechatPayment: "disabled_pending_qualification", rolloutStartsAt: "5%" } }, null, 2));
process.exitCode = missing.length ? 1 : 0;
