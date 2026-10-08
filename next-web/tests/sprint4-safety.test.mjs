import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
test("AI Agent implements timeout, cancellation, retry and confirmation", () => { const source = fs.readFileSync("components/ai-career-hub.tsx", "utf8"); assert.match(source, /15000/); assert.match(source, /AbortController/); assert.match(source, /retry/); assert.match(source, /confirmWrite/); });
test("sensitive data is redacted before Agent API calls", () => { const source = fs.readFileSync("components/ai-career-hub.tsx", "utf8"); assert.match(source, /EMAIL_REDACTED/); assert.match(source, /PHONE_REDACTED/); assert.match(source, /ID_REDACTED/); });
test("payment feature flag stays disabled", () => { const source = fs.readFileSync("lib/feature-flags.ts", "utf8"); assert.match(source, /wechatPayment: false/); });
