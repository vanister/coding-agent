export class ConversationNotFoundError extends Error {
  constructor(conversationId: string) {
    super(`Conversation ${conversationId} not found`);
    this.name = 'ConversationNotFoundError';
  }
}

export class ConversationAlreadyExistsError extends Error {
  constructor(conversationId: string) {
    super(`Conversation ${conversationId} already exists`);
    this.name = 'ConversationAlreadyExistsError';
  }
}

export class ConversationDataCorruptedError extends Error {
  constructor(conversationId: string, details: string) {
    super(`Conversation ${conversationId} data is corrupted: ${details}`);
    this.name = 'ConversationDataCorruptedError';
  }
}

export class InvalidMessageError extends Error {
  constructor(details: string) {
    super(`Invalid message: ${details}`);
    this.name = 'InvalidMessageError';
  }
}
