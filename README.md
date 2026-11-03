# CLOVE AI

**An open-source desktop AI assistant and reusable TypeScript SDK.**

CLOVE is an Electron desktop app with provider-compatible chat, local conversation history, local text-file context, and a reusable TypeScript core. This is early development software; Windows packaging and speech support still need validation.

## Requirements
- Node.js 20+
- npm
- Cloud mode: API key for an OpenAI-compatible provider (may cost money)
- Local mode: Ollama installed and a model pulled (no API fee; model download uses disk space)

## Run on Windows
```powershell
npm install
npm run dev
```

## Build and package
```powershell
npm run typecheck
npm run build
npm run dist
```
The installer is configured to output under `release/`. Build/package has not yet been verified on Windows.

## Local AI with Ollama (no API key)
1. Install Ollama from https://ollama.com/download.
2. In PowerShell, run `ollama pull qwen2.5:3b`. This downloads model files and needs free disk space.
3. Start Ollama. Its default local endpoint is `http://127.0.0.1:11434`.
4. Open CLOVE Settings and enable **Use local Ollama (no API key)**.
5. Keep the local URL, select `qwen2.5:3b`, save, and chat.

CLOVE does not download models automatically. After pulling another model with `ollama pull <model-tag>`, choose that tag in the local model menu. Local mode is restricted in the desktop main process to localhost HTTP endpoints.

## Cloud mode
Disable local mode and set an API key, HTTPS base URL, and model. The endpoint must support OpenAI-compatible `/chat/completions`. CLOVE does not include API credits. Do not send sensitive documents to providers unless you have permission and understand their data policies.

## Desktop features
- Electron + React + Vite desktop shell
- OpenAI-compatible cloud chat
- Local Ollama `/api/chat` integration
- Cloud/local mode switch
- Electron safeStorage-backed API key storage when supported
- Local conversation history
- Local text/source file context (PDF intentionally excluded until real extraction is implemented)
- Voice input/output hooks using available speech APIs; support varies by Windows/Electron build

## SDK
`packages/core` exports `Assistant`, `createAssistant`, and `OpenAICompatibleProvider`.
```ts
import { Assistant, OpenAICompatibleProvider } from "@clove-ai/core";
const provider = new OpenAICompatibleProvider({ apiKey: process.env.AI_API_KEY });
const assistant = new Assistant({ provider, model: "your-model" });
const result = await assistant.ask("Hello!");
console.log(result.content);
```

## Security
- Never commit API keys.
- Cloud credentials are stored in app user data using Electron secure storage when available.
- Conversation history stays local unless sent in a chat request.
- File contents are sent to the configured provider when included in a prompt.
- Local mode only permits localhost endpoints; cloud endpoints require HTTPS.
- Review this early-development software before using confidential data.

## Project layout
- `apps/desktop`: Electron + React desktop application
- `packages/core`: provider-neutral assistant SDK and provider adapter
- `examples/sdk`: integration examples

## Status
- [x] Desktop UI and cloud chat path
- [x] Local settings and encrypted key storage where available
- [x] Local conversation persistence
- [x] Local text/source file context
- [x] Ollama local chat and localhost validation
- [x] Cloud/local settings toggle
- [x] Speech API hooks
- [x] Reusable provider adapter
- [ ] Automated tests and Windows packaging verification
- [ ] PDF text extraction/OCR
- [ ] Native computer actions and provider adapters

## License
MIT. See [LICENSE](LICENSE).
