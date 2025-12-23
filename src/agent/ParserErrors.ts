export class JsonParseError extends Error {
  constructor(message: string, public readonly rawText: string, public readonly parseError: Error) {
    super(message);
    this.name = 'JsonParseError';
  }
}
