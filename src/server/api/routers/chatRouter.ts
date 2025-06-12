import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { chatHandler } from "../handlers/chatHandler";

export const chatRouter = router({
    sendMessage: publicProcedure
      .input(z.object({
        messages: z.array(z.object({
          id: z.string(),
          createdAt: z.date().optional(),
          content: z.string(),
          role: z.enum(['system', 'user', 'assistant', 'data']),
          reasoning: z.string().optional(),
          experimental_attachments: z.any().optional(),
          data: z.any().optional(),
          annotations: z.array(z.any()).optional(),
          toolInvocations: z.array(z.any()).optional(),
          parts: z.array(z.any()).optional(),
        }))
      }))
      .mutation(async ({ input, ctx }) => {
        // Now the input already matches what useChat sends
        const result = await chatHandler.generateStreamingResponse(input.messages);
        return result;
      }),
});