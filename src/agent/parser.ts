import { JsonParseError } from './ParserErrors.js';
import { buildJsonParseErrorMessage } from './parserHelpers.js';

/**
 * Removes markdown code fences from LLM responses.
 *
 * LLMs often wrap JSON responses in markdown fences like:
 * ```json
 * { "tool": "file_read", "args": {...} }
 * ```
 *
 * This function strips those fences to get clean JSON for parsing.
 */
export function stripMarkdown(text: string): string {
  if (!text) {
    return '';
  }

  return text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
}

/**
 * Parses raw text into JavaScript object.
 *
 * Strips markdown fences and attempts JSON.parse.
 *
 * @param rawText - Raw string response from LLM
 * @returns Parsed JavaScript object
 * @throws {JsonParseError} If JSON parsing fails (malformed JSON)
 */
export function parseJson(rawText: string): unknown {
  const stripped = stripMarkdown(rawText);

  try {
    return JSON.parse(stripped);
  } catch (error) {
    const parseError = error as Error;
    const message = buildJsonParseErrorMessage(stripped, parseError);
    throw new JsonParseError(message, stripped, parseError);
  }
}
