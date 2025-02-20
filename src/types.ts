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
}

export interface APIResponse {
  choices: [{
    message: {
      content: string;
    };
  }];
} 