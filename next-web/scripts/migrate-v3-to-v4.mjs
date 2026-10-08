import fs from "node:fs";
import path from "node:path";
export function transformV3(data) {
  const users = (data.users || []).map((user) => ({ ...user, profile_completeness: user.profile_completeness ?? 0, v4_migrated_at: new Date().toISOString() }));
  const resumes = (data.resumes || []).map((resume) => ({ ...resume, kind: resume.kind || "General Resume", is_default: Boolean(resume.is_default), status: resume.status || "active", legacy_id: resume.id }));
  const applications = (data.applications || []).map((app) => ({ ...app, status: app.status || "Interested", legacy_id: app.id }));
  return { version: "4.0", migratedAt: new Date().toISOString(), users, resumes, applications, manifest: { userIds: users.map((x) => x.id), resumeIds: resumes.map((x) => x.id), applicationIds: applications.map((x) => x.id) } };
}
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/(.:)/, "$1"))) {
  const input = process.argv[2]; const write = process.argv.includes("--write");
  if (!input || !fs.existsSync(input)) { console.log("Usage: npm run migrate:v3 -- <v3-export.json> [--write]\nDry-run is the default."); process.exit(0); }
  const result = transformV3(JSON.parse(fs.readFileSync(input, "utf8"))); console.log(JSON.stringify({ dryRun: !write, counts: { users: result.users.length, resumes: result.resumes.length, applications: result.applications.length } }, null, 2));
  if (write) { const output = path.join(path.dirname(input), `v4-migrated-${Date.now()}.json`); fs.writeFileSync(output, JSON.stringify(result, null, 2)); console.log(`Migration artifact: ${output}`); }
}
