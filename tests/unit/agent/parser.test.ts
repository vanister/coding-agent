import { describe, it, expect } from 'vitest';
import { stripMarkdown, parseJson } from '../../../src/agent/parser.js';
import { JsonParseError } from '../../../src/agent/ParserErrors.js';

describe('stripMarkdown', () => {
  it('should pass through raw JSON unchanged', () => {
    const input = '{ "tool": "file_read", "args": { "path": "test.txt" } }';
    const result = stripMarkdown(input);
    expect(result).toBe(input);
  });

  it('should remove markdown fences with json language specifier', () => {
    const input = '```json\n{ "tool": "file_read", "args": { "path": "test.txt" } }\n```';
    const expected = '{ "tool": "file_read", "args": { "path": "test.txt" } }';
    const result = stripMarkdown(input);
    expect(result).toBe(expected);
  });

  it('should remove markdown fences without language specifier', () => {
    const input = '```\n{ "tool": "file_read", "args": { "path": "test.txt" } }\n```';
    const expected = '{ "tool": "file_read", "args": { "path": "test.txt" } }';
    const result = stripMarkdown(input);
    expect(result).toBe(expected);
  });

  it('should handle fences without trailing newlines', () => {
    const input = '```json{ "done": true, "response": "Complete" }```';
    const expected = '{ "done": true, "response": "Complete" }';
    const result = stripMarkdown(input);
    expect(result).toBe(expected);
  });

  it('should trim leading and trailing whitespace', () => {
    const input = '  \n```json\n{ "tool": "file_read" }\n```\n  ';
    const expected = '{ "tool": "file_read" }';
    const result = stripMarkdown(input);
    expect(result).toBe(expected);
  });

  it('should handle multiple fence patterns in sequence', () => {
    const input = '```json\n```\n{ "tool": "file_read" }\n```';
    const expected = '{ "tool": "file_read" }';
    const result = stripMarkdown(input);
    expect(result).toBe(expected);
  });

  it('should handle json fence with newline after opening', () => {
    const input = '```json\n{ "done": true }\n```\n';
    const expected = '{ "done": true }';
    const result = stripMarkdown(input);
    expect(result).toBe(expected);
  });

  it('should handle empty content between fences', () => {
    const input = '```json\n\n```';
    const expected = '';
    const result = stripMarkdown(input);
    expect(result).toBe(expected);
  });
  it('should handle empty string input', () => {
    const input = '';
    const expected = '';
    const result = stripMarkdown(input);
    expect(result).toBe(expected);
  });
});

describe('parseJson', () => {
  describe('successful parsing', () => {
    it('should parse valid JSON', () => {
      const input = '{ "tool": "file_read", "args": { "path": "test.txt" } }';
      const result = parseJson(input);
      expect(result).toEqual({
        tool: 'file_read',
        args: { path: 'test.txt' }
      });
    });

    it('should parse JSON with nested objects', () => {
      const input = '{ "done": true, "response": "Task completed successfully" }';
      const result = parseJson(input);
      expect(result).toEqual({
        done: true,
        response: 'Task completed successfully'
      });
    });

    it('should parse JSON after stripping markdown fences', () => {
      const input = '```json\n{ "tool": "file_read", "args": { "path": "test.txt" } }\n```';
      const result = parseJson(input);
      expect(result).toEqual({
        tool: 'file_read',
        args: { path: 'test.txt' }
      });
    });

    it('should parse arrays', () => {
      const input = '[1, 2, 3]';
      const result = parseJson(input);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should parse primitives', () => {
      const input = '"hello"';
      const result = parseJson(input);
      expect(result).toBe('hello');
    });
  });

  describe('JSON parse errors', () => {
    it('should throw JsonParseError for malformed JSON', () => {
      const input = '{ "tool": "file_read", "args": { "path": "test.txt" }';
      expect(() => parseJson(input)).toThrow(JsonParseError);
    });

    it('should throw JsonParseError for invalid JSON syntax', () => {
      const input = '{ tool: file_read }';
      expect(() => parseJson(input)).toThrow(JsonParseError);
    });

    it('should include raw text in JsonParseError', () => {
      const input = 'not json at all';
      try {
        parseJson(input);
        expect.fail('Should have thrown JsonParseError');
      } catch (error) {
        expect(error).toBeInstanceOf(JsonParseError);
        expect((error as JsonParseError).rawText).toBe(input);
      }
    });

    it('should throw JsonParseError for trailing commas', () => {
      const input = '{ "tool": "test", }';
      expect(() => parseJson(input)).toThrow(JsonParseError);
    });

    it('should throw JsonParseError for single quotes', () => {
      const input = "{ 'tool': 'test' }";
      expect(() => parseJson(input)).toThrow(JsonParseError);
    });
  });
});

describe('Enhanced Error Messages', () => {
  describe('JsonParseError enhancements', () => {
    it('should include valid format examples in error message', () => {
      const input = 'not json';
      try {
        parseJson(input);
        expect.fail('Should have thrown JsonParseError');
      } catch (error) {
        expect(error).toBeInstanceOf(JsonParseError);
        const message = (error as Error).message;
        expect(message).toContain('Expected format:');
        expect(message).toContain('Tool call:');
        expect(message).toContain('Completion:');
      }
    });

    it('should include common fixes in error message', () => {
      const input = '{ "tool": "test", }'; // Trailing comma
      try {
        parseJson(input);
        expect.fail('Should have thrown JsonParseError');
      } catch (error) {
        expect(error).toBeInstanceOf(JsonParseError);
        const message = (error as Error).message;
        expect(message).toContain('Common fixes:');
      }
    });

    it('should show received text for short inputs', () => {
      const input = 'bad';
      try {
        parseJson(input);
        expect.fail('Should have thrown JsonParseError');
      } catch (error) {
        expect(error).toBeInstanceOf(JsonParseError);
        const message = (error as Error).message;
        expect(message).toContain('Received:');
      }
    });
  });
});
