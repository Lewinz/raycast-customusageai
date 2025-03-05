export interface Template {
  id: string;
  name: string;
  content: string;
  useCount: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Preferences {
  apiHost: string;
  modelName: string;
  apiKey: string;
  provider: "openai" | "qianwen" | "custom";
}

export interface APIResponse {
  choices: [{
    message: {
      content: string;
    };
  }];
}

export interface APIConfig {
  endpoint: string;
  headers: Record<string, string>;
  requestBody: (messages: any[]) => any;
}

export const API_PROVIDERS = {
  openai: {
    endpoint: (host: string) => `${host}/chat/completions`,
    headers: (apiKey: string) => ({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    }),
    requestBody: (messages: any[], modelName: string) => ({
      model: modelName,
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  },
  qianwen: {
    endpoint: (host: string) => `${host}/services/aigc/text-generation/generation`,
    headers: (apiKey: string) => ({
      "Content-Type": "application/json",
      "Authorization": apiKey,
    }),
    requestBody: (messages: any[], modelName: string) => ({
      model: modelName,
      input: {
        messages,
      },
      parameters: {
        temperature: 0.7,
        top_p: 0.8,
        result_format: "message",
      },
    }),
  },
  custom: {
    endpoint: (host: string) => host,
    headers: (apiKey: string) => ({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    }),
    requestBody: (messages: any[], modelName: string) => ({
      model: modelName,
      messages,
    }),
  },
}; 