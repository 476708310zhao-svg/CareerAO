import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9333;
const url = process.argv[2] || "http://127.0.0.1:3000/preview";
const artifactDir = path.resolve("artifacts", "preview-qa");
const profileDir = await mkdtemp(path.join(tmpdir(), "zhiyin-preview-qa-"));

await mkdir(artifactDir, { recursive: true });

const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  "--no-default-browser-check",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`,
  "about:blank",
], { windowsHide: true, stdio: "ignore" });

async function waitForBrowser() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (response.ok) return response.json();
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 125));
  }
  throw new Error("Chrome DevTools endpoint did not become ready.");
}

class Cdp {
  constructor(webSocketUrl) {
    this.socket = new WebSocket(webSocketUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
        return;
      }
      const callbacks = this.listeners.get(message.method) || [];
      callbacks.splice(0).forEach((callback) => callback(message.params));
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  waitFor(method, timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
      const callbacks = this.listeners.get(method) || [];
      const timer = setTimeout(() => reject(new Error(`Timed out waiting for ${method}`)), timeoutMs);
      callbacks.push((params) => {
        clearTimeout(timer);
        resolve(params);
      });
      this.listeners.set(method, callbacks);
    });
  }

  close() {
    this.socket.close();
  }
}

const viewports = [
  { width: 375, height: 812, name: "mobile-375" },
  { width: 768, height: 960, name: "tablet-768" },
  { width: 1024, height: 900, name: "desktop-1024" },
  { width: 1440, height: 1000, name: "desktop-1440" },
];

let client;
try {
  const targets = await waitForBrowser();
  const target = targets.find((item) => item.type === "page");
  if (!target) throw new Error("No Chrome page target was found.");
  client = new Cdp(target.webSocketDebuggerUrl);
  await client.connect();
  await client.send("Page.enable");
  await client.send("Runtime.enable");

  const results = [];
  for (const viewport of viewports) {
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.width < 600,
    });
    const loaded = client.waitFor("Page.loadEventFired");
    await client.send("Page.navigate", { url });
    await loaded;
    await client.send("Runtime.evaluate", {
      expression: "new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))",
      awaitPromise: true,
    });

    const { result } = await client.send("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const root = document.documentElement;
        const body = document.body;
        const headings = [...document.querySelectorAll('h1,h2,h3')];
        const unnamed = [...document.querySelectorAll('a,button,summary')].filter((element) => {
          const name = element.getAttribute('aria-label') || element.getAttribute('title') || element.textContent;
          return !name || !name.trim();
        });
        const keyTargets = [...document.querySelectorAll('.pv-button,.zy-button,.zy-mobile-menu summary')]
          .filter((element) => getComputedStyle(element).display !== 'none')
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return { label: (element.textContent || element.getAttribute('aria-label') || '').trim(), width: Math.round(rect.width), height: Math.round(rect.height) };
          });
        const mobileMenu = [...document.querySelectorAll('.zy-mobile-menu')].find((element) => element.getBoundingClientRect().width > 0);
        let mobileMenuCheck = null;
        if (mobileMenu && getComputedStyle(mobileMenu).display !== 'none') {
          mobileMenu.open = true;
          const navRect = mobileMenu.querySelector('nav').getBoundingClientRect();
          mobileMenuCheck = { visible: navRect.width > 0 && navRect.height > 0, insideViewport: navRect.left >= 0 && navRect.right <= root.clientWidth };
          mobileMenu.open = false;
        }
        return {
          viewport: { width: root.clientWidth, height: innerHeight },
          scrollWidth: Math.max(root.scrollWidth, body.scrollWidth),
          horizontalOverflow: Math.max(root.scrollWidth, body.scrollWidth) > root.clientWidth,
          headingOverflow: headings.filter((heading) => {
            const rect = heading.getBoundingClientRect();
            return rect.left < -1 || rect.right > root.clientWidth + 1;
          }).map((heading) => heading.textContent.trim()),
          unnamedControls: unnamed.length,
          keyTargets,
          mobileMenuCheck,
          demoDataMentions: (body.innerText.match(/演示数据/g) || []).length,
          sections: document.querySelectorAll('main section').length,
          productLinks: [...document.querySelectorAll('.pv-proof-links a')].map((link) => link.getAttribute('href')),
        };
      })()`,
    });

    const screenshot = await client.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: false,
    });
    const screenshotPath = path.join(artifactDir, `${viewport.name}.png`);
    await writeFile(screenshotPath, Buffer.from(screenshot.data, "base64"));

    let fullScreenshotPath = null;
    if ([375, 1440].includes(viewport.width)) {
      const metrics = await client.send("Page.getLayoutMetrics");
      const contentSize = metrics.cssContentSize;
      const fullScreenshot = await client.send("Page.captureScreenshot", {
        format: "png",
        fromSurface: true,
        captureBeyondViewport: true,
        clip: { x: 0, y: 0, width: viewport.width, height: contentSize.height, scale: 1 },
      });
      fullScreenshotPath = path.join(artifactDir, `${viewport.name}-full.png`);
      await writeFile(fullScreenshotPath, Buffer.from(fullScreenshot.data, "base64"));
    }

    await client.send("Runtime.evaluate", { expression: "document.body.focus()" });
    await client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
    await client.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
    const focusResult = await client.send("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => { const el = document.activeElement; return { tag: el?.tagName, text: (el?.textContent || el?.getAttribute?.('aria-label') || '').trim().slice(0,80) }; })()`,
    });

    results.push({ ...result.value, firstTabFocus: focusResult.result.value, screenshot: screenshotPath, fullScreenshot: fullScreenshotPath });
  }

  await writeFile(path.join(artifactDir, "results.json"), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally {
  client?.close();
  chrome.kill();
  const resolvedProfile = path.resolve(profileDir);
  if (resolvedProfile.startsWith(path.resolve(tmpdir()))) {
    await rm(resolvedProfile, { recursive: true, force: true }).catch(() => {});
  }
}
