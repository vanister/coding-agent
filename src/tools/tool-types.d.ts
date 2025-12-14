import type { z } from "zod";

export type Tool<TArgs = Record<string, unknown>> = {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  argsSchema: z.ZodSchema<TArgs>;
  execute: (args: TArgs) => Promise<ToolResult>;
};

export type ToolCall = {
  name: string;
  args: Record<string, unknown>;
};

export type ToolResult = {
  success: boolean;
  data?: unknown;
  error?: string;
};
