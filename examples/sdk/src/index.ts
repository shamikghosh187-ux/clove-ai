import { createAssistant, type ChatProvider } from "@clove-ai/core";

// Implement ChatProvider with your chosen model API, then pass it here.
// This example intentionally does not contain or request an API key.
const provider: ChatProvider = {
  id: "your-provider",
  async chat() {
    throw new Error("Connect a provider adapter before running this example.");
  }
};

const assistant = createAssistant({
  provider,
  model: "your-model",
  systemPrompt: "You are CLOVE, a helpful AI assistant."
});

console.log(await assistant.ask("Hello, CLOVE!"));
