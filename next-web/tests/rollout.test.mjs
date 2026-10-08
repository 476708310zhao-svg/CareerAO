import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
test("rollout follows 5 to 20 to 50 to 100 percent", () => { const config = JSON.parse(fs.readFileSync("config/rollout.json", "utf8")); assert.deepEqual(config.stages.map((stage) => stage.percentage), [5, 20, 50, 100]); assert.equal(config.rollback.targetPercentage, 0); });
test("real WeChat payment remains disabled", () => { const env = fs.readFileSync(".env.example", "utf8"); assert.match(env, /WECHAT_PAYMENT_ENABLED=false/); });
