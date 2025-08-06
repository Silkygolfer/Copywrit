'use client'
import { memo, useRef, useEffect, useCallback } from 'react';
import equal from 'fast-deep-equal';
import { Id } from '../../../convex/_generated/dataModel';
import { UIMessage } from 'ai';
import OptimisticAssistantMessage from './assistant-message';
import Message from './Message';



function PureMessages({
  threadId,
  messages,
  registerRef,
  sentMessageIds,
  businessId,
}: {
  threadId: Id<"threads">;
  messages: (UIMessage & { streamId: Id<'streams'> })[];
  registerRef: (id: string, ref: HTMLDivElement | null) => void;
  sentMessageIds: Set<string>;
  businessId: Id<"businesses">;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const lastMessage = messages[messages.length - 1];
  const shouldShowOptimistic = lastMessage?.role === 'user';
  


  // Scroll function
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current && containerRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <div className="relative h-full">
      <section 
        ref={containerRef}
        className="flex flex-col space-y-8 pb-8 h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#a8dadc]/40 scrollbar-thumb-rounded-full rounded-lg"
      >
        
        {messages.map((message) => {
          return (
            <Message
              key={message.id}
              message={message}
              threadId={threadId}
              registerRef={registerRef}
            />
          );
        })}

        {shouldShowOptimistic && (
          <OptimisticAssistantMessage
            businessId={businessId}
            threadId={threadId}
            userMessageId={lastMessage.id}
            streamId={lastMessage.streamId}
            sentMessageIds={sentMessageIds}
            onStreamUpdate={scrollToBottom}
          />
        )}
        <div ref={messagesEndRef} />
      </section>
    </div>
  );
}

const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  
  // Check if any message content has changed (important for streaming updates)
  if (!equal(prevProps.messages, nextProps.messages)) return false;
  
  return true;
});

Messages.displayName = 'Messages';

export default Messages;
