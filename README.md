# CLOVE AI

**A personal AI assistant for desktop and application integration.**

CLOVE is an open-source starter for building a configurable AI assistant that can run as a desktop app and be embedded into other software through a reusable TypeScript core.

> Status: early development. APIs and desktop experience are not stable yet.

## What we're building

- A desktop assistant for Windows, macOS, and Linux (Electron).
- A reusable TypeScript assistant core for other applications.
- Provider configuration through user-supplied API keys.
- Conversation history and settings stored locally.
- A clear separation between the desktop interface and assistant engine.

## Project structure

```
apps/
  desktop/       # Electron + React desktop application (planned)
packages/
  core/          # reusable assistant engine
examples/
  sdk/           # integration example
```

## Getting started

The first development milestone is the reusable core. Desktop packaging and additional providers will follow.

Requirements:
- Node.js 20+
- npm

```bash
npm install
npm run build
```

## Provider setup

CLOVE does not ship with an API key. Configure your own provider credentials in the application or pass them to the core at runtime. Never commit secrets or place private API keys in frontend code.

## Development

```bash
npm run typecheck
npm run build
```

## Roadmap

- [x] Create public repository and project foundation
- [ ] Reusable provider-neutral assistant core
- [ ] OpenAI-compatible provider adapter
- [ ] Electron desktop shell
- [ ] Local conversation/settings persistence
- [ ] Additional provider adapters
- [ ] Documentation and release builds

## License

MIT. See [LICENSE](LICENSE).
