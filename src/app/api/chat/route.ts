import { NextRequest } from 'next/server';
import { ConvexHttpClient } from "convex/browser";
import { api } from '../../../../convex/_generated/api';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {  
  try {
    const { messages, threadId, clientName = 'Default Client' } = await req.json();
    
    // Validate required inputs
    if (!threadId) {
      return new Response('Thread ID is required', { status: 400 });
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
    
    // 4. Start Convex streaming action using the component (fire and forget)
    const result = await convex.action(api.streaming.streamChatResponse, {
      messages,
      threadId,
      clerkUserId: userId,
      clientName,
    }).catch(error => {
      console.error('Convex streaming error:', error);
      return { success: false, error: error.message };
    });

    // 5. Return immediate response with stream ID
    return new Response(JSON.stringify({ 
      success: result.success, 
      streamId: result.success ? (result as any).streamId : null,
      threadId 
    }), {
      status: result.success ? 200 : 500,
      headers: {
        'Content-Type': 'application/json',
        'X-Thread-ID': threadId,
        ...(result.success && (result as any).streamId ? { 'X-Stream-ID': (result as any).streamId } : {}),
      },
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}