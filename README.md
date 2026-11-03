# CLOVE AI

**An open-source desktop AI assistant and reusable TypeScript SDK.**

CLOVE is an Electron desktop app with provider-compatible chat, local conversation history, local document context, and a reusable provider-neutral core. This is an early project; features marked experimental may need testing on Windows.

## Requirements
- Node.js 20+
- npm
- API key for an OpenAI-compatible chat-completions provider (usage may cost money)

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
The installer is configured to output under `release/`. Build/package has not yet been verified on a Windows machine.

## Desktop features
- Electron + React + Vite desktop shell
- OpenAI-compatible `/chat/completions` provider endpoint
- API key and endpoint/model configuration in Settings
- Electron safeStorage-backed API key storage when supported
- Local conversation list and saved messages
- Open supported local text/code/PDF documents for prompt context (PDF extraction is basic text parsing; scanned PDFs need OCR and may not work)
- Voice input/output using the browser's available speech APIs; availability varies by Windows/Electron build

## Provider setup
In Settings, set API key, HTTPS base URL (default OpenAI endpoint), and model name. The endpoint must support OpenAI-compatible chat completions. CLOVE does not include API credits. Do not send sensitive documents to providers unless you have permission and understand their data policies.

## SDK
`packages/core` exports `Assistant`, `createAssistant`, and `OpenAICompatibleProvider`. Example:
```ts
import { Assistant, OpenAICompatibleProvider } from "@clove-ai/core";
const provider = new OpenAICompatibleProvider({ apiKey: process.env.AI_API_KEY });
const assistant = new Assistant({ provider, model: "your-model" });
const result = await assistant.ask("Hello!");
console.log(result.content);
```

## Security notes
- Never commit API keys.
- Credentials are stored in the app's local user-data folder using Electron secure storage when available.
- Conversation history and document excerpts remain local unless included in a chat request.
- Prompt content and attachments included in chat are sent to the configured provider.
- Check custom provider URLs before entering credentials.
- CLOVE is early development software. Review the code before using it with confidential data.

## Project layout
- `apps/desktop`: Electron + React desktop application
- `packages/core`: provider-neutral assistant SDK and compatible provider adapter
- `examples/sdk`: integration examples

## Status
- [x] Desktop UI and API chat path
- [x] Local settings and encrypted key storage where available
- [x] Local conversation persistence
- [x] Local text/code/document context
- [x] Voice input/output hooks
- [x] Reusable provider adapter
- [ ] Automated tests and Windows packaging verification
- [ ] OCR for scanned PDFs
- [ ] More native desktop actions/provider adapters

## License
MIT. See [LICENSE](LICENSE).
