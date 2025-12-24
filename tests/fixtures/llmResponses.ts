export const SIMPLE_CHAT_RESPONSE = {
  message: {
    content: 'Hello! How can I help you today?'
  }
};

export const TOOL_CALL_RESPONSE = {
  message: {
    content: '```json\n{"tool": "file_read", "args": {"path": "test.txt"}}\n```'
  }
};

export const COMPLETION_RESPONSE = {
  message: {
    content: '```json\n{"done": true, "response": "Task completed successfully"}\n```'
  }
};

export const MARKDOWN_WRAPPED_TOOL_CALL =
  '```json\n{"tool": "file_read", "args": {"path": "example.txt"}}\n```';

export const PLAIN_TOOL_CALL = '{"tool": "file_read", "args": {"path": "example.txt"}}';

export const MARKDOWN_WRAPPED_COMPLETION = '```json\n{"done": true, "response": "All done!"}\n```';

export const PLAIN_COMPLETION = '{"done": true, "response": "All done!"}';
