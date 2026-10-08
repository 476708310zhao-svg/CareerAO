import { spawn } from "node:child_process";
import path from "node:path";
const port = 4394; const base = `http://127.0.0.1:${port}`;
const nextCli = path.resolve("node_modules/next/dist/bin/next");
const server = spawn(process.execPath, [nextCli, "start", "-p", String(port)], { stdio: "ignore", env: { ...process.env, PORT: String(port) } });
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function ready() { for (let i = 0; i < 40; i++) { try { if ((await fetch(`${base}/today`)).ok) return; } catch {} await wait(500); } throw new Error("Next.js server did not become ready"); }
try { await ready(); const routes = ["/today", "/applications", "/interviews", "/interviews/interview-anthropic", "/ai-career", "/pricing", "/admin/analytics", "/api/quota?plan=free"]; const results = []; for (const route of routes) { const started = performance.now(); const response = await fetch(base + route); const elapsedMs = Math.round(performance.now() - started); if (!response.ok) throw new Error(`${route} returned ${response.status}`); if (elapsedMs > 3000) throw new Error(`${route} exceeded local 3s smoke threshold`); results.push({ route, status: response.status, elapsedMs }); } console.log(JSON.stringify({ status: "passed", results }, null, 2)); } finally { server.kill(); }
