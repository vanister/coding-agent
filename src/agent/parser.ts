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
    return "";
  }

  return text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
}
