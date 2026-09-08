export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    actionKey: string;
    variant?: "default" | "outline" | "secondary";
  }[];
  metadata?: {
    model?: string;
    tokensUsed?: number;
    category?: "syllabus" | "retention" | "scheduling" | "qualiopi" | "general";
  };
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessageSnippet: string;
  updatedAt: string;
  category: "syllabus" | "retention" | "scheduling" | "qualiopi" | "general";
  messages: ChatMessage[];
}

export interface PromptStarter {
  id: string;
  title: string;
  description: string;
  category: "syllabus" | "retention" | "scheduling" | "qualiopi";
  prompt: string;
}
