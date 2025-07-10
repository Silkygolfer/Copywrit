import { httpAction } from "./_generated/server";
import { StreamId } from "@convex-dev/persistent-text-streaming";
import { google } from "@ai-sdk/google";
import { streamingComponent } from "./streaming";
import { streamText } from "ai";
import { api } from "./_generated/api";
import { convertDBMessageToUIMessage } from "../src/lib/utils/convert-db-to-core-messages";



export const streamChat = httpAction(async (ctx, request) => {
  const body = (await request.json()) as {
    streamId: string;
    threadId: string;
  };

  // Start streaming and persisting at the same time while
  // we immediately return a streaming response to the client
  const response = await streamingComponent.stream(
    ctx,
    request,
    body.streamId as StreamId,
    async (ctx, request, streamId, append) => {
      // Lets grab the history up to now so that the AI has some context
    const messages = await ctx.runQuery(api.messages.listMessages, { threadId: body.threadId });
    const history = messages.map(convertDBMessageToUIMessage);

      // Lets kickoff a stream request to OpenAI
      const stream = streamText({
        model: google("gemini-1.5-flash"),
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that can answer questions and help with tasks.
          Please provide your response in markdown format.
          
          You are continuing a conversation. The conversation so far is found in the following JSON-formatted value:`,
          },
          ...history,
        ],
      });

      // Append each chunk to the persistent stream as they come in from openai
      for await (const part of stream.textStream)
        await append(part);
    }
  );

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Vary", "Origin");

  return response;
});