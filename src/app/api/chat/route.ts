import { NextRequest } from 'next/server';
import { ConvexHttpClient } from "convex/browser";
import { auth } from '@clerk/nextjs/server';
import { smoothStream, streamText, convertToModelMessages } from 'ai';
import { anthropic } from '@ai-sdk/anthropic'
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { StreamProcessor } from '@/lib/utils/stream-processor';
import { v4 as uuidv4 } from 'uuid';
import { copywritToolSet } from '@/lib/services/tools';
import { SystemPromptBuilder } from '@/lib/utils/system-prompt-builder';
import { markdownJoinerTransform } from '@/lib/helpers/markdown-render';
import { dbMessageToUIMessage, uiMessageToDBMessage } from '../../../../convex/lib/message-converters';

type ChatRequest = {
  threadId: Id<"threads">,
  streamId: Id<"streams">,
  businessId: Id<"businesses">,
}


export async function POST(req: NextRequest) {  
  try {
    const { threadId, streamId, businessId }: ChatRequest = await req.json();
    
    // Validate required inputs
    if (!threadId) {
      return new Response('Thread ID is required', { status: 400 });
    }

    if (!streamId) {
      return new Response('Stream ID is required', { status: 400 });
    }

    if (!businessId) {
      return new Response('Business ID is required', { status: 400 });
    }
    
    // 1. Get the authenticated user from Clerk
    const { getToken, userId } = await auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    // 2. Get Clerk JWT token for Convex
    const token = await getToken({ template: 'convex' });
    if (!token) {
      return new Response('Unable to get auth token', { status: 401 });
    }
    
    // 3. Initialize Convex client with Clerk token
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    convex.setAuth(token);

    // Get the message associated with this streamId
    const message = await convex.query(api.messages.getMessageByStreamId, { streamId });
    if (!message) {
      return new Response('Message not found', { status: 404 });
    }

    // Get the message history from the thread + convert to UI messages
    const dbHistory = await convex.query(api.messages.listMessages, { threadId });
    const history = dbHistory.map(dbMessageToUIMessage);

    // create a new message array with the history and the new message
    const messages = [...history, dbMessageToUIMessage(message)];

    // Create a new messageId for assistant message
    const assistantMessageId = uuidv4();

    // Initialize stream processor and system prompt builder
    const streamProcessor = new StreamProcessor(streamId, token);
    const systemPromptBuilder = new SystemPromptBuilder(businessId);
    const systemPrompt = await systemPromptBuilder.buildSystemPrompt();
    
    // 4. Trigger streamText function

    // convert UIMessages to ModelMessages
    const modelMessages = convertToModelMessages(messages);

    const result = streamText({
      model: anthropic('claude-3-5-haiku-latest'),
      messages: modelMessages,
      system: systemPrompt,
      tools: copywritToolSet,
      toolChoice: "auto",
      experimental_transform: [
        markdownJoinerTransform(),
        smoothStream({
        delayInMs: 20,
        chunking: 'word'
      })],
      onChunk: async (chunk) => {
          await streamProcessor.processChunk(chunk.chunk.type === 'text-delta' ? chunk.chunk.text : '');
      },
    
    });


    // 5. Return the streaming response
    return result.toUIMessageStreamResponse({
      onFinish: async (message) => {
        await streamProcessor.flush();

        const dbMessage = uiMessageToDBMessage(message.responseMessage);

        await convex.mutation(api.messages.addMessage, {
          ...dbMessage,
          threadId,
          streamId,
          clerkUserId: userId,
          createdAt: Date.now(),
        });
      }
    })
    
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}