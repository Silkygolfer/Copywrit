'use client'
import { memo, useEffect } from 'react';
import SimpleMarkdown from './SimpleMarkdown';
import { cn } from '@/lib/utils/twUtils';
import { UIMessage } from 'ai';
import equal from 'fast-deep-equal';
import MessageControls from './MessageControls';
import MessageReasoning from './MessageReasoning';
import { MessageToolInvocation } from './MessageToolInvocation';
import { api } from '../../../convex/_generated/api';
import { useStream } from '@convex-dev/persistent-text-streaming/react';
import { StreamId } from '@convex-dev/persistent-text-streaming';

function PureMessage({
  threadId,
  message,
  isActiveStream,
  onStreamComplete,
  registerRef,
}: {
  threadId: string;
  message: UIMessage & { streamId?: string };
  isActiveStream: boolean;
  onStreamComplete: (streamText: string) => Promise<void>;
  registerRef: (id: string, ref: HTMLDivElement | null) => void;
}) {
  // Only use streaming for messages that are actively streaming
  const { text: streamText, status: streamStatus } = useStream(
    api.streaming.getStreamBody,
    new URL(`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/chat-stream`),
    isActiveStream, // Only drive when this message is the active stream
    message.streamId as StreamId
  );

  // Handle stream completion
  useEffect(() => {
    if (isActiveStream && streamStatus === 'done' && streamText) {
      onStreamComplete(streamText);
    }
  }, [isActiveStream, streamStatus, streamText, onStreamComplete]);

  // Determine what text to display
  const getDisplayText = (part: { type: string; text: string }) => {
    if (message.role === 'user') {
      return part.text; // Always use DB content for user messages
    }
    
    // For assistant messages during streaming
    if (isActiveStream && streamText) {
      return streamText; // Use live streaming text
    }
    
    // For assistant messages after streaming or non-streaming
    return part.text; // Use DB content
  };

  return (
    <div
      role="article"
      className={cn(
        'flex flex-col',
        message.role === 'user' ? 'items-end' : 'items-start'
      )}
    >
      {message.parts.map((part, index) => {
        const { type } = part;
        const key = `message-${message.id}-part-${index}`;

        if (type === 'reasoning') {
          return (
            <MessageReasoning
              key={key}
              reasoning={part.reasoning}
              id={message.id}
            />
          );
        }

        if (type === 'tool-invocation') {
          return (
            <MessageToolInvocation
              key={key}
              toolInvocation={part.toolInvocation}
              id={message.id}
            />
          );
        }

        if (type === 'text') {
          const displayText = getDisplayText(part);
          
          return message.role === 'user' ? (
            <div
              key={key}
              className="relative group px-5 py-4 rounded-2xl bg-copywrit-navy text-copywrit-cream shadow-lg border border-copywrit-cream/20 max-w-[80%] ml-auto"
              ref={(el) => registerRef(message.id, el)}
            >
              <div className="mb-2">
                {displayText}
              </div>
              <MessageControls
                threadId={threadId}
                content={displayText}
                message={message}
              />
            </div>
          ) : (
            <div key={key} className="group flex flex-col gap-3 w-full">
              <div className="bg-transparent text-copywrit-cream rounded-2xl p-5 max-w-[85%]">
                <SimpleMarkdown 
                  content={displayText} 
                />
              </div>
              {/* Only show controls when not actively streaming */}
              {!(isActiveStream && streamStatus === 'streaming') && (
                <MessageControls
                  threadId={threadId}
                  content={displayText}
                  message={message}
                />
              )}
            </div>
          );
        }
      })}
    </div>
  );
}

const PreviewMessage = memo(PureMessage, (prevProps, nextProps) => {
  if (prevProps.isActiveStream !== nextProps.isActiveStream) return false;
  if (prevProps.message.id !== nextProps.message.id) return false;
  if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;
  return true;
});

PreviewMessage.displayName = 'PreviewMessage';

export default PreviewMessage;
