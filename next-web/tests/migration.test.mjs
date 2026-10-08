import test from "node:test";
import assert from "node:assert/strict";
import { transformV3 } from "../scripts/migrate-v3-to-v4.mjs";
test("V3 migration preserves IDs and applies safe defaults", () => { const result = transformV3({ users: [{ id: "u1" }], resumes: [{ id: "r1" }], applications: [{ id: "a1" }] }); assert.equal(result.users[0].id, "u1"); assert.equal(result.resumes[0].kind, "General Resume"); assert.equal(result.applications[0].status, "Interested"); assert.deepEqual(result.manifest.resumeIds, ["r1"]); });
test("V3 migration handles empty exports", () => { const result = transformV3({}); assert.equal(result.users.length, 0); assert.equal(result.resumes.length, 0); });
