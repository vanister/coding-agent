export class ToolRegistryError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "ToolRegistryError";
  }
}

export class ToolAlreadyRegisteredError extends Error {
  constructor(toolName: string) {
    super(`Tool '${toolName}' is already registered`);
    this.name = "ToolAlreadyRegisteredError";
  }
}
