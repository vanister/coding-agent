import type { z } from "zod";
import type {
  messageRoleSchema,
  messageSchema,
  llmResultSchema,
  ollamaChatResponseSchema
} from "./schemas.js";

export type MessageRole = z.infer<typeof messageRoleSchema>;
export type Message = z.infer<typeof messageSchema>;
export type LlmResult = z.infer<typeof llmResultSchema>;
export type OllamaChatResponse = z.infer<typeof ollamaChatResponseSchema>;
