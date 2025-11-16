// Agent-specific types

import type { Message } from "../shared/types";

export type AgentMetrics = {
  iterations: number;
  toolCalls: number;
  parseErrors: number;
  tokensUsed?: number;
};

export type AgentResult = {
  response: string;
  success: boolean;
  metrics?: AgentMetrics;
};

export type ContextBuilder = {
  buildInitial: (input: string) => Message[];
};

// Note: AgentServices type deferred to Phase 2 when LLMService, ToolRegistry,
// and ConversationHistory interfaces are defined
