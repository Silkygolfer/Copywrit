'use client'
import Messages from './Messages';
import MemoizedChatInput from './chat-input';
import { useCallback, useRef, useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { Id } from '../../../convex/_generated/dataModel';
import { UIMessage } from 'ai';
import { dbMessageToUIMessage } from '../../../convex/lib/message-converters';
import { v4 as uuidv4 } from 'uuid';
import { useBusiness } from '@/app/providers/business-provider';
import { useChat } from '@ai-sdk/react';

interface ChatProps {
  threadId: Id<"threads"> | null;
}

export default function Chat({ threadId }: ChatProps) {
  // Auth
  const { user, isLoaded } = useUser();

  // Business
  const { businessId } = useBusiness();

  // Queries
  const dbmessages = useQuery(api.messages.listMessages, threadId ? { threadId } : "skip");

  // Refs
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const registerRef = useCallback((id: string, ref: HTMLDivElement | null) => {
    messageRefs.current[id] = ref;
  }, []);

  // State - track sent message IDs instead of thread IDs
  const [sentMessageIds, setSentMessageIds] = useState<Set<string>>(new Set());

  // Hooks
  const { messages, sendMessage, status } = useChat({
    transport: convexStreamTransport({
      api, 
    })
    body: {
      threadId,
      businessId,
    },
  });

  const handleSendMessage = useCallback(async (message: UIMessage) => {

    if (!threadId || !user) {
      return;
    }

    try {
      // Generate a unique message ID
      const messageId = uuidv4();
      
      // Extract text content from parts for backward compatibility
      const textPart = message.parts.find((part: any) => part.type === 'text') as any;
      const content = textPart?.text || '';
      
      // Create the message in the database
      await sendMessage({
        id: messageId,
        role: message.role,
        parts: message.parts,
        metadata: message.metadata,
        threadId: threadId,
        clerkUserId: user.id,
      });

      // Add the message ID to our tracking set
      setSentMessageIds(prev => new Set([...prev, messageId]));
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [threadId, user, sendMessage]);

  // Handle initial message from localStorage
  useEffect(() => {
    if (threadId) {
      try {
        const initialMessage = localStorage.getItem('initialMessage')
        if (initialMessage) {
          const parsedMessage = JSON.parse(initialMessage);
          handleSendMessage(parsedMessage.message as UIMessage);
          localStorage.removeItem('initialMessage')
        }
      } catch (error) {
        console.error('Failed to send initial message:', error);
      }
    }
  }, [threadId, handleSendMessage]); // Dependencies ensure this runs when threadId or user changes

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 overflow-y-auto">
        {!threadId ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold">Beautifully on-brand copy awaits...</h1>
          </div>
        ) : (
          <Messages
            threadId={threadId}
            messages={messages || []}
            registerRef={registerRef}
            sentMessageIds={sentMessageIds}
            businessId={businessId}
          />
        )}
      </div>

      <div className="flex-shrink-0">
        <MemoizedChatInput
          threadId={threadId}
          onSendMessage={handleSendMessage}
          isLoading={!isLoaded}
        />
      </div>
    </div>
  );
}

