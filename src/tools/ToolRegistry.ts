import type { Tool, ToolCall, ToolResult } from "./tool-types.js";

export interface ToolRegistry {
  register(tool: Tool): void;
  execute(toolCall: ToolCall): Promise<ToolResult>;
  list(): Tool[];
}

export class InMemoryToolRegistry implements ToolRegistry {
  private readonly tools: Map<string, Tool> = new Map();

  register(tool: Tool): void {
    throw new Error("Not implemented");
  }

  async execute(toolCall: ToolCall): Promise<ToolResult> {
    throw new Error("Not implemented");
  }

  list(): Tool[] {
    throw new Error("Not implemented");
  }
}
