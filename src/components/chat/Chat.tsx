'use client'
import Messages from './Messages';
import ChatInput from './ChatInput';
import { useCallback, useRef, useState, useMemo } from 'react';
import { UIMessage } from 'ai';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { convertDBMessageToUIMessage } from '@/lib/utils/convert-db-to-core-messages';
import { toast } from 'sonner';

interface ChatProps {
  threadId?: string
}

export default function Chat({ threadId }: ChatProps) {
  // Auth
  const { user } = useUser();

  // Queries
  const messages = useQuery(
    api.messages.listMessages, 
    threadId ? { threadId } : "skip"
  );

  // Mutations
  const addUserMessage = useMutation(api.messages.addMessage);
  const addAssistantMessage = useMutation(api.messages.addMessage);

  // Refs
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const registerRef = useCallback((id: string, ref: HTMLDivElement | null) => {
    messageRefs.current[id] = ref;
  }, []);


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
            messages={messages}
            registerRef={registerRef}
            activeStreamId={activeStreamId}
            onStreamComplete={handleStreamComplete}
          />
        )}
      </div>

      <div className="flex-shrink-0">
        <ChatInput
          threadId={threadId}
          onSendMessage={sendMessage}
          isLoading={isStreaming}
        />
      </div>
    </div>
  );
}

