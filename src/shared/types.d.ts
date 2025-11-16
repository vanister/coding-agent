// Core types used across the agent system

export type MessageRole = "system" | "user" | "assistant";

export type Message = {
  role: MessageRole;
  content: string;
};

export type LLMResponse = {
  content: string;
  raw: string; // Original response for debugging
};
