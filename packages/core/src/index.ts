export type Role = "system" | "user" | "assistant";

export interface Message {
  role: Role;
  content: string;
}

export interface ChatRequest {
  messages: Message[];
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatResponse {
  content: string;
  model: string;
  provider: string;
}

export interface ChatProvider {
  readonly id: string;
  chat(request: ChatRequest): Promise<ChatResponse>;
}

export interface AssistantOptions {
  provider: ChatProvider;
  model: string;
  systemPrompt?: string;
}

/**
 * Small provider-neutral assistant wrapper.
 * Provider credentials and network calls belong in provider adapters,
 * not in UI components.
 */
export class Assistant {
  private readonly provider: ChatProvider;
  private readonly model: string;
  private readonly systemPrompt: string;

  constructor(options: AssistantOptions) {
    this.provider = options.provider;
    this.model = options.model;
    this.systemPrompt = options.systemPrompt ?? "You are a helpful AI assistant.";
  }

  async ask(input: string, history: Message[] = []): Promise<ChatResponse> {
    const messages: Message[] = [
      { role: "system", content: this.systemPrompt },
      ...history.filter((message) => message.role !== "system"),
      { role: "user", content: input }
    ];

    return this.provider.chat({ messages, model: this.model });
  }
}

export function createAssistant(options: AssistantOptions): Assistant {
  return new Assistant(options);
}
