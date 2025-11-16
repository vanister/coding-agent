// Tool system types

import { z } from "zod";

export type ToolParameters = Record<string, unknown>;

export type ToolExecutor<TArgs extends Record<string, unknown>> = (
  args: TArgs
) => Promise<ToolResult>;

export type Tool<TArgs extends Record<string, unknown> = Record<string, unknown>> = {
  name: string;
  description: string;
  parameters: ToolParameters; // Human-readable for LLM
  argsSchema: z.ZodSchema<TArgs>; // Machine validation with Zod
  execute: ToolExecutor<TArgs>;
};

export type ToolCall = {
  name: string;
  args: Record<string, unknown>; // Required, can be empty {}
};

export type ToolResult = {
  success: boolean;
  data?: unknown;
  error?: string;
};
