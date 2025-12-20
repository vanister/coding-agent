import type { z } from "zod";
import type { conversationSchema } from "./schemas.js";

export type Conversation = z.infer<typeof conversationSchema>;
