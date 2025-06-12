import { google } from '@ai-sdk/google';
import { generateText, streamText, Message } from 'ai';

export const chatService = {
    generateText: async (prompt: string) => {
        const response = await generateText({
            model: google('gemini-2.5-pro-preview-05-06'),
            prompt,
        });
        return response.text;
    },
    
    generateStreamingResponse: async (messages: Message[]) => {
        // Use streamText for streaming responses
        const result = streamText({
            model: google('gemini-2.5-pro-preview-05-06'),
            messages: messages.map(msg => ({
                role: msg.role,
                content: msg.content,
            })),
        });
        
        // Return the streaming response that useChat expects
        return result.toDataStreamResponse();
    }
}