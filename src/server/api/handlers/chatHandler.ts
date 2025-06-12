import { chatService } from "@/server/services/chatService"
import { Message } from 'ai'

export const chatHandler = {
  generateText: async (prompt: string) => {
    return chatService.generateText(prompt)
  },
  generateStreamingResponse: async (messages: Message[]) => {
    return chatService.generateStreamingResponse(messages)
  }
}