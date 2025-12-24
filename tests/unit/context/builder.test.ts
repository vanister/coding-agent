import { describe, it, expect } from 'vitest';
import { buildContext } from '../../../src/context/builder.js';
import { ContextBuilderError } from '../../../src/context/ContextErrors.js';
import type { Message } from '../../../src/llm/schemas.js';

describe('buildContext', () => {
  it('should append user message to empty history', () => {
    const input = 'Read test.txt';
    const history: Message[] = [];

    const result = buildContext(input, history);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      role: 'user',
      content: 'Read test.txt'
    });
  });

  it('should append user message to non-empty history', () => {
    const input = 'Now summarize it';
    const history: Message[] = [
      { role: 'system', content: 'You are an assistant' },
      { role: 'user', content: 'Read test.txt' },
      { role: 'assistant', content: '{ "tool": "file_read", "args": { "path": "test.txt" } }' }
    ];

    const result = buildContext(input, history);

    expect(result).toHaveLength(4);
    expect(result[0]).toEqual(history[0]);
    expect(result[1]).toEqual(history[1]);
    expect(result[2]).toEqual(history[2]);
    expect(result[3]).toEqual({
      role: 'user',
      content: 'Now summarize it'
    });
  });

  it('should not mutate original history array', () => {
    const input = 'Read test.txt';
    const history: Message[] = [{ role: 'system', content: 'System prompt' }];
    const originalLength = history.length;

    buildContext(input, history);

    expect(history).toHaveLength(originalLength);
  });

  it('should throw ContextBuilderError for empty input', () => {
    const history: Message[] = [];

    expect(() => buildContext('', history)).toThrow(ContextBuilderError);
    expect(() => buildContext('', history)).toThrow('Input cannot be empty');
  });

  it('should throw ContextBuilderError for whitespace-only input', () => {
    const history: Message[] = [];

    expect(() => buildContext('   ', history)).toThrow(ContextBuilderError);
    expect(() => buildContext('\n\t  ', history)).toThrow(ContextBuilderError);
  });

  it('should preserve input with leading/trailing spaces', () => {
    const input = '  Read test.txt  ';
    const history: Message[] = [];

    const result = buildContext(input, history);

    expect(result[0].content).toBe('  Read test.txt  ');
  });

  it('should handle history with system prompt as first message', () => {
    const systemPrompt = 'You are a coding assistant with access to tools.';
    const input = 'Help me read a file';
    const history: Message[] = [{ role: 'system', content: systemPrompt }];

    const result = buildContext(input, history);

    expect(result).toHaveLength(2);
    expect(result[0].role).toBe('system');
    expect(result[0].content).toBe(systemPrompt);
    expect(result[1].role).toBe('user');
    expect(result[1].content).toBe(input);
  });
});
