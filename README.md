# CLOVE AI

**A personal AI assistant for desktop and application integration.**

CLOVE is an early open-source starter for a configurable desktop assistant and reusable TypeScript core.

## Desktop app

Electron + React + Vite. The raw API key stays in Electron's main process and is stored with Electron `safeStorage` when available.

### Requirements

- Node.js 20+
- npm
- API key from an OpenAI-compatible provider

### Run on Windows

Open PowerShell in the repository folder:

```powershell
npm install
npm run dev
```

### Build / package

```powershell
npm run typecheck
npm run build
npm run dist
```

Installer output is placed in `release/`.

## Configure

Open Settings and enter:
- API key
- API base URL (default `https://api.openai.com/v1`)
- Model (default `gpt-4o-mini`)

CLOVE sends requests to `/chat/completions`. Compatible providers may work, depending on their API format and model access. Provider usage can cost money; CLOVE does not include API credits.

## Security

- Never commit API keys or secrets.
- Keys are saved locally using Electron secure storage where available.
- Prompts and credentials are sent to the configured provider endpoint.
- Verify provider URLs before using them.
- This project is early development; review before using sensitive data.

## Layout

- `apps/desktop`: Electron + React desktop application
- `packages/core`: reusable TypeScript assistant core
- `examples/sdk`: integration example

## Roadmap

- [x] Repository and initial foundation
- [x] Desktop UI and provider request path
- [ ] Build/test on Windows
- [ ] Provider adapter abstraction
- [ ] Local conversation history
- [ ] Additional provider adapters
- [ ] Integration docs

## License

MIT. See [LICENSE](LICENSE).
