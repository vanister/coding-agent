import { describe, it, expect } from "vitest";
import { stripMarkdown } from "../../../src/agent/parser.js";

describe("stripMarkdown", () => {
  it("should pass through raw JSON unchanged", () => {
    const input = '{ "tool": "file_read", "args": { "path": "test.txt" } }';
    const result = stripMarkdown(input);
    expect(result).toBe(input);
  });

  it("should remove markdown fences with json language specifier", () => {
    const input = '```json\n{ "tool": "file_read", "args": { "path": "test.txt" } }\n```';
    const expected = '{ "tool": "file_read", "args": { "path": "test.txt" } }';
    const result = stripMarkdown(input);
    expect(result).toBe(expected);
  });

  it("should remove markdown fences without language specifier", () => {
    const input = '```\n{ "tool": "file_read", "args": { "path": "test.txt" } }\n```';
    const expected = '{ "tool": "file_read", "args": { "path": "test.txt" } }';
    const result = stripMarkdown(input);
    expect(result).toBe(expected);
  });

  it("should handle fences without trailing newlines", () => {
    const input = '```json{ "done": true, "response": "Complete" }```';
    const expected = '{ "done": true, "response": "Complete" }';
    const result = stripMarkdown(input);
    expect(result).toBe(expected);
  });

  it("should trim leading and trailing whitespace", () => {
    const input = '  \n```json\n{ "tool": "file_read" }\n```\n  ';
    const expected = '{ "tool": "file_read" }';
    const result = stripMarkdown(input);
    expect(result).toBe(expected);
  });

  it("should handle multiple fence patterns in sequence", () => {
    const input = '```json\n```\n{ "tool": "file_read" }\n```';
    const expected = '{ "tool": "file_read" }';
    const result = stripMarkdown(input);
    expect(result).toBe(expected);
  });

  it("should handle json fence with newline after opening", () => {
    const input = '```json\n{ "done": true }\n```\n';
    const expected = '{ "done": true }';
    const result = stripMarkdown(input);
    expect(result).toBe(expected);
  });

  it("should handle empty content between fences", () => {
    const input = "```json\n\n```";
    const expected = "";
    const result = stripMarkdown(input);
    expect(result).toBe(expected);
  });
  it("should handle empty string input", () => {
    const input = "";
    const expected = "";
    const result = stripMarkdown(input);
    expect(result).toBe(expected);
  });
});
