export class ContextBuilderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContextBuilderError';
  }
}
