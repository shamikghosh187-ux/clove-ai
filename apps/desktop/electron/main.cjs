const { app, BrowserWindow, ipcMain, safeStorage, dialog } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const isDev = !app.isPackaged;
let win;
const settingsPath = () => path.join(app.getPath("userData"), "clove-settings.json");
const historyPath = () => path.join(app.getPath("userData"), "clove-conversations.json");
function readSettings() {
  try {
    const s = JSON.parse(fs.readFileSync(settingsPath(), "utf8"));
    let apiKey = "";
    if (s.encryptedKey && safeStorage.isEncryptionAvailable()) apiKey = safeStorage.decryptString(Buffer.from(s.encryptedKey, "base64"));
    const localMode = !!s.localMode;
    return { apiKey, localMode, baseUrl: s.baseUrl || (localMode ? "http://127.0.0.1:11434" : "https://api.openai.com/v1"), model: s.model || (localMode ? "qwen2.5:3b" : "gpt-4o-mini") };
  } catch { return { apiKey: "", localMode: false, baseUrl: "https://api.openai.com/v1", model: "gpt-4o-mini" }; }
}
function saveSettings(s) {
  const prior = readSettings();
  const localMode = !!s.localMode;
  const submitted = String(s.apiKey || "").trim();
  const apiKey = submitted === "••••••••" ? prior.apiKey : submitted;
  const baseUrl = String(s.baseUrl || (localMode ? "http://127.0.0.1:11434" : "https://api.openai.com/v1")).trim().replace(/\/$/, "");
  if (localMode) {
    let parsed;
    try { parsed = new URL(baseUrl); } catch { throw Error("Enter a valid local Ollama URL."); }
    if (!["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname) || parsed.protocol !== "http:") throw Error("Local mode only allows HTTP localhost URLs.");
  } else if (!/^https:\/\//i.test(baseUrl)) throw Error("Cloud provider URL must use HTTPS.");
  const out = { baseUrl, model: String(s.model || (localMode ? "qwen2.5:3b" : "gpt-4o-mini")).trim(), localMode };
  if (!localMode && apiKey && safeStorage.isEncryptionAvailable()) out.encryptedKey = safeStorage.encryptString(apiKey).toString("base64");
  else if (!localMode && apiKey) throw Error("Secure local key storage is unavailable; CLOVE did not save the key.");
  fs.mkdirSync(path.dirname(settingsPath()), { recursive: true });
  fs.writeFileSync(settingsPath(), JSON.stringify(out, null, 2), { mode: 0o600 });
}
function readHistory() { try { return JSON.parse(fs.readFileSync(historyPath(), "utf8")); } catch { return []; } }
function writeHistory(items) { fs.mkdirSync(path.dirname(historyPath()), { recursive: true }); fs.writeFileSync(historyPath(), JSON.stringify(items.slice(-100), null, 2), { mode: 0o600 }); return { ok: true }; }
function createWindow() {
  win = new BrowserWindow({ width: 1180, height: 760, minWidth: 800, minHeight: 560, backgroundColor: "#09090f", title: "CLOVE AI", webPreferences: { preload: path.join(__dirname, "preload.cjs"), contextIsolation: true, nodeIntegration: false, sandbox: true } });
  if (isDev) win.loadURL("http://127.0.0.1:5173"); else win.loadFile(path.join(__dirname, "../../../dist/desktop/index.html"));
}
ipcMain.handle("clove:settings:get", () => { const s = readSettings(); return { ...s, apiKey: s.apiKey ? "••••••••" : "" }; });
ipcMain.handle("clove:settings:save", (_e, s) => { saveSettings(s); return { ok: true }; });
ipcMain.handle("clove:history:get", () => readHistory());
ipcMain.handle("clove:history:save", (_e, items) => writeHistory(Array.isArray(items) ? items : []));
ipcMain.handle("clove:file:open", async () => {
  const result = await dialog.showOpenDialog(win, { properties: ["openFile", "multiSelections"], filters: [{ name: "Text and source files", extensions: ["txt", "md", "json", "js", "ts", "tsx", "html", "css", "csv"] }] });
  if (result.canceled) return [];
  return result.filePaths.map(filePath => ({ name: path.basename(filePath), path: filePath, content: fs.readFileSync(filePath, "utf8").slice(0, 150000) }));
});
ipcMain.handle("clove:chat", async (_e, request) => {
  const s = readSettings();
  const model = request.model || s.model;
  if (s.localMode) {
    const response = await fetch(s.baseUrl.replace(/\/$/, "") + "/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model, messages: request.messages, stream: false, options: { temperature: 0.7 } }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw Error(data.error || "Ollama request failed. Start Ollama and ensure the selected model is downloaded.");
    const content = data.message && data.message.content;
    if (typeof content !== "string") throw Error("Ollama returned no text response.");
    return { content, model: data.model || model };
  }
  if (!s.apiKey) throw Error("Add an API key in Settings or enable Local Ollama mode.");
  const response = await fetch(s.baseUrl.replace(/\/$/, "") + "/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + s.apiKey }, body: JSON.stringify({ model, messages: request.messages, temperature: 0.7 }) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw Error((data.error && data.error.message) || "Provider request failed (" + response.status + "). Check endpoint, model, and key.");
  const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (typeof content !== "string") throw Error("Provider returned no text response.");
  return { content, model: data.model || model };
});
ipcMain.handle("clove:ollama:check", async () => { const s=readSettings(); const base=s.localMode?s.baseUrl:"http://127.0.0.1:11434"; let parsed; try { parsed=new URL(base); } catch { throw Error("Invalid Ollama URL."); } if(!["localhost","127.0.0.1","[::1]"].includes(parsed.hostname)||parsed.protocol!=="http:") throw Error("Ollama check is restricted to localhost."); const response=await fetch(base.replace(/\/$/,"")+"/api/tags",{signal:AbortSignal.timeout(5000)}); const data=await response.json().catch(()=>({})); if(!response.ok)throw Error("Ollama returned HTTP "+response.status); return {ok:true,models:Array.isArray(data.models)?data.models.map(m=>m.name).filter(Boolean):[]}; });\napp.whenReady().then(() => { createWindow(); app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); }); });
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
