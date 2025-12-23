import { describe, it, expect } from 'vitest';
import { validateResponse } from '../../../src/agent/validator.js';

describe('validateResponse', () => {
  describe('successful validation', () => {
    it('should validate tool call response', () => {
      const parsed = { tool: 'file_read', args: { path: 'test.txt' } };
      const result = validateResponse(parsed);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          tool: 'file_read',
          args: { path: 'test.txt' }
        });
      }
    });

    it('should validate tool call with empty args', () => {
      const parsed = { tool: 'list_tools', args: {} };
      const result = validateResponse(parsed);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          tool: 'list_tools',
          args: {}
        });
      }
    });

    it('should validate completion response', () => {
      const parsed = { done: true, response: 'Task completed successfully' };
      const result = validateResponse(parsed);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          done: true,
          response: 'Task completed successfully'
        });
      }
    });

    it('should validate tool call with nested args', () => {
      const parsed = {
        tool: 'complex_tool',
        args: {
          nested: { deep: { value: 'test' } },
          array: [1, 2, 3]
        }
      };
      const result = validateResponse(parsed);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(parsed);
      }
    });
  });

  describe('validation errors', () => {
    it('should return error for missing tool field', () => {
      const parsed = { args: { path: 'test.txt' } };
      const result = validateResponse(parsed);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors.some((e) => e.includes('tool'))).toBe(true);
        expect(result.zodError).toBeDefined();
      }
    });

    it('should return error for missing args field', () => {
      const parsed = { tool: 'file_read' };
      const result = validateResponse(parsed);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors.some((e) => e.includes('args'))).toBe(true);
        expect(result.zodError).toBeDefined();
      }
    });

    it('should return error for missing response field', () => {
      const parsed = { done: true };
      const result = validateResponse(parsed);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors.some((e) => e.includes('response'))).toBe(true);
        expect(result.zodError).toBeDefined();
      }
    });

    it('should return error for done: false', () => {
      const parsed = { done: false, response: 'Not done yet' };
      const result = validateResponse(parsed);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors.some((e) => e.includes('done'))).toBe(true);
        expect(result.zodError).toBeDefined();
      }
    });

    it('should return error for wrong args type', () => {
      const parsed = { tool: 'file_read', args: 'should be object' };
      const result = validateResponse(parsed);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors.some((e) => e.includes('args'))).toBe(true);
        expect(result.errors.some((e) => e.includes('object'))).toBe(true);
        expect(result.zodError).toBeDefined();
      }
    });

    it('should return error for wrong response type', () => {
      const parsed = { done: true, response: 123 };
      const result = validateResponse(parsed);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors.some((e) => e.includes('response'))).toBe(true);
        expect(result.errors.some((e) => e.includes('string'))).toBe(true);
        expect(result.zodError).toBeDefined();
      }
    });

    it('should return error for unknown fields (strict mode)', () => {
      const parsed = { tool: 'file_read', args: {}, extra: 'field' };
      const result = validateResponse(parsed);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.zodError).toBeDefined();
      }
    });

    it('should return error for neither tool nor done', () => {
      const parsed = { something: 'else' };
      const result = validateResponse(parsed);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.zodError).toBeDefined();
      }
    });

    it('should return error for both tool and done fields', () => {
      const parsed = { tool: 'file_read', args: {}, done: true, response: 'test' };
      const result = validateResponse(parsed);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.zodError).toBeDefined();
      }
    });

    it('should include received keys in error messages', () => {
      const parsed = { invalid: 'structure', with: 'wrong', keys: true };
      const result = validateResponse(parsed);

      expect(result.success).toBe(false);
      if (!result.success) {
        const keysError = result.errors.find((e) => e.includes('Received object'));
        expect(keysError).toBeDefined();
        expect(keysError).toContain('invalid');
        expect(keysError).toContain('with');
        expect(keysError).toContain('keys');
      }
    });

    it('should handle non-object input gracefully', () => {
      const parsed = 'not an object';
      const result = validateResponse(parsed);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.zodError).toBeDefined();
      }
    });

    it('should handle null input', () => {
      const parsed = null;
      const result = validateResponse(parsed);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.zodError).toBeDefined();
      }
    });

    it('should handle array input', () => {
      const parsed = [{ tool: 'file_read', args: {} }];
      const result = validateResponse(parsed);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.zodError).toBeDefined();
      }
    });

    it('should provide multiple granular error messages', () => {
      const parsed = { tool: 123, args: 'wrong' };
      const result = validateResponse(parsed);

      expect(result.success).toBe(false);
      if (!result.success) {
        // Should have at least 2 errors (tool wrong type, args wrong type)
        expect(result.errors.length).toBeGreaterThanOrEqual(2);
        expect(result.errors.some((e) => e.includes('tool'))).toBe(true);
        expect(result.errors.some((e) => e.includes('args'))).toBe(true);
      }
    });
  });
});
