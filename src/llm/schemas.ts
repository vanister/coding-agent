import { z } from "zod";

export const messageRoleSchema = z.enum(["system", "user", "assistant"]);

export const messageSchema = z.object({
  role: messageRoleSchema,
  content: z.string()
});

export const llmResultSchema = z.object({
  content: z.string()
});

export const ollamaChatResponseSchema = z.object({
  message: z.object({
    content: z.string()
  })
});
