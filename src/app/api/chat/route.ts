import { NextRequest } from 'next/server';
import { chatHandler } from '@/server/api/handlers/chatHandler';

export async function POST(req: NextRequest) {
  // Just pass through to your existing handler - no extra logic
  const { messages } = await req.json();
  return chatHandler.generateStreamingResponse(messages);
}