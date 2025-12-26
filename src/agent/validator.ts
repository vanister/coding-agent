import type { ZodError } from 'zod';
import {
  toolCallResponseSchema,
  completionResponseSchema,
  type ValidationResult
} from './schemas.js';
import { formatZodError } from './parserHelpers.js';

/**
 * Validates parsed JSON against expected response schemas.
 *
 * Tries two valid response types:
 * 1. Completion: { "done": true, "response": "..." }
 * 2. Tool call: { "tool": "tool_name", "args": {...} }
 *
 * @param parsed - Pre-parsed JavaScript object to validate
 * @returns ValidationResult with either validated data or array of error messages
 */
export function validateResponse(parsed: unknown): ValidationResult {
  const completionResult = completionResponseSchema.safeParse(parsed);

  if (completionResult.success) {
    return { success: true, data: completionResult.data };
  }

  const toolCallResult = toolCallResponseSchema.safeParse(parsed);

  if (toolCallResult.success) {
    return { success: true, data: toolCallResult.data };
  }

  // Neither schema matched - determine which error to report
  // If the input has 'done' field, user was trying completion format
  const hasCompletionField = typeof parsed === 'object' && parsed !== null && 'done' in parsed;
  const zodError = hasCompletionField ? completionResult.error : toolCallResult.error;
  const errors = buildValidationErrors(zodError, parsed);

  return {
    success: false,
    errors,
    zodError
  };
}

/**
 * Builds array of validation error messages from Zod error.
 */
function buildValidationErrors(zodError: ZodError, parsed: unknown): string[] {
  const errors: string[] = [];

  // Add individual field errors
  zodError.issues.forEach((issue) => {
    const pathStr = issue.path.join('.');
    const fieldName = pathStr || 'root';

    let errorMsg = `Field "${fieldName}": ${issue.message}`;

    if (issue.code === 'invalid_type') {
      const invalidTypeIssue = issue as { received?: string; expected?: string };
      const received = invalidTypeIssue.received || 'unknown';
      const expected = invalidTypeIssue.expected || 'unknown';

      errorMsg = `Field "${fieldName}": Expected ${expected} but received ${received}`;
    }

    errors.push(errorMsg);
  });

  // Add context about received shape if it's an object
  if (typeof parsed === 'object' && parsed !== null) {
    const shape = parsed as Record<string, unknown>;
    const keys = Object.keys(shape);

    if (keys.length > 0) {
      errors.push(`Received object with keys: ${keys.join(', ')}`);
    }
  }

  return errors;
}
