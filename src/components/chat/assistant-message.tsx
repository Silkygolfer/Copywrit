'use client'
import { useChat } from '../../hooks/use-chat';
import { Id } from '../../../convex/_generated/dataModel';
import SimpleMarkdown from './simple-markdown';
import { useEffect } from 'react';

interface OptimisticAssistantMessageProps {
  threadId: Id<"threads">;
  userMessageId: string;
  streamId: Id<'streams'>;
  businessId: Id<'businesses'>;
  sentMessageIds: Set<string>;
  onStreamUpdate?: () => void;
}

export default function OptimisticAssistantMessage({
  threadId,
  userMessageId,
  streamId,
  businessId,
  sentMessageIds,
  onStreamUpdate,
}: OptimisticAssistantMessageProps) {
  
  const { text, status } = useChat({
    businessId: businessId,
    threadId: threadId,
    isDriving: sentMessageIds.has(userMessageId),
    streamId: streamId,
  });

  // Trigger scroll callback when streaming content updates
  useEffect(() => {
    if (status === 'streaming' && onStreamUpdate) {
      onStreamUpdate();
    }
  }, [text, status, onStreamUpdate]);

  
  if (status === 'pending') {
    return (
      <div className="group flex flex-col gap-3 w-full">
        <div className="bg-transparent text-copywrit-cream rounded-2xl p-5 max-w-[85%] animate-pulse">
          <span className="opacity-70">Assistant is thinking...</span>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="group flex flex-col gap-3 w-full">
        <div className="bg-transparent text-red-400 rounded-2xl p-5 max-w-[85%]">
          <span>Error loading assistant response.</span>
        </div>
      </div>
    );
  }

  // Render streaming or completed text
  return (
    <div className="group flex flex-col gap-3 w-full">
      <div className="bg-transparent text-copywrit-cream rounded-2xl p-5 max-w-[85%]">
        <SimpleMarkdown content={text || ''} />
      </div>
    </div>
  );
} 