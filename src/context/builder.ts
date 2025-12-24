import type { Message } from '../llm/schemas.js';
import { ContextBuilderError } from './ContextErrors.js';

export function buildContext(input: string, history: Message[]): Message[] {
  if (!input || input.trim().length === 0) {
    throw new ContextBuilderError('Input cannot be empty');
  }

  return [
    ...history,
    {
      role: 'user',
      content: input
    }
  ];
}
