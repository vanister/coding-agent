import type { Message } from "../llm/llm-types.js";
import type { ConversationRepository } from "./ConversationRepository.js";
import { ConversationAlreadyExistsError, ConversationNotFoundError } from "./ConversationError.js";

export interface ConversationHistoryService {
  create(): Promise<void>;
  add(message: Message): Promise<void>;
  getAll(): Promise<Message[]>;
  clear(): Promise<void>;
  estimateTokens(): Promise<number>;
}

export class InMemoryConversationHistoryService implements ConversationHistoryService {
  constructor(
    private readonly conversationId: string,
    private readonly repository: ConversationRepository
  ) {}

  async create(): Promise<void> {
    const existing = await this.repository.get(this.conversationId);

    if (existing) {
      throw new ConversationAlreadyExistsError(this.conversationId);
    }

    const now = new Date();
    const conversation = {
      id: this.conversationId,
      messages: [],
      createdAt: now,
      updatedAt: now
    };

    await this.repository.create(this.conversationId, conversation);
  }

  async add(message: Message): Promise<void> {
    const conversation = await this.repository.get(this.conversationId);

    if (!conversation) {
      throw new ConversationNotFoundError(this.conversationId);
    }

    await this.repository.add(this.conversationId, message);
    conversation.updatedAt = new Date();
  }

  async getAll(): Promise<Message[]> {
    const conversation = await this.repository.get(this.conversationId);
    return conversation ? conversation.messages : [];
  }

  async clear(): Promise<void> {
    const conversation = await this.repository.get(this.conversationId);

    if (!conversation) {
      throw new ConversationNotFoundError(this.conversationId);
    }

    await this.repository.update(this.conversationId, []);
    conversation.updatedAt = new Date();
  }

  async estimateTokens(): Promise<number> {
    const messages = await this.getAll();
    const totalChars = messages.reduce((sum, msg) => sum + msg.content.length, 0);

    // Heuristic: ~4 chars per token is a common approximation for English text
    // This is intentionally simple for MVP; can be refined with actual tokenizer later
    return Math.ceil(totalChars / 4);
  }
}
