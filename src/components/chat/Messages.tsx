'use client'
import { memo, useEffect, useRef, useState } from 'react';
import PreviewMessage from './Message';
import { UIMessage } from 'ai';
import equal from 'fast-deep-equal';
import { Button } from '../ui/button';
import { ArrowDownIcon } from 'lucide-react';

function PureMessages({
  threadId,
  messages,
  registerRef,
  activeStreamId,
  onStreamComplete,
}: {
  threadId: string;
  messages: (UIMessage & { streamId?: string })[];
  registerRef: (id: string, ref: HTMLDivElement | null) => void;
  activeStreamId: string | null;
  onStreamComplete: (streamText: string) => Promise<void>;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Check if user is near bottom to show/hide scroll button
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Check for overflow and show button when content changes
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const hasOverflow = scrollHeight > clientHeight;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      // Show button if there's overflow and user is not at bottom
      setShowScrollButton(hasOverflow && !isNearBottom);
    }
  }, [messages]);

  // Auto-scroll for user messages (always) and AI messages (only if at bottom)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
    
    // Always scroll for user messages, only scroll for AI messages if already at bottom
    if (lastMessage.role === 'user' || isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-full">
      <section 
        ref={containerRef}
        className="flex flex-col space-y-8 pb-8 h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#a8dadc]/40 scrollbar-thumb-rounded-full rounded-lg"
      >
        {messages.map((message) => (
          <PreviewMessage
            key={message.id}
            threadId={threadId}
            message={message}
            isActiveStream={activeStreamId === message.streamId}
            onStreamComplete={onStreamComplete}
            registerRef={registerRef}
          />
        ))}
        <div ref={messagesEndRef} />
      </section>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Button
            onClick={scrollToBottom}
            size="sm"
            className="bg-copywrit-navy/80 hover:bg-copywrit-navy text-copywrit-cream border border-copywrit-cream/20 shadow-lg backdrop-blur-sm"
            aria-label="Scroll to bottom"
          >
            <ArrowDownIcon size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}

const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.activeStreamId !== nextProps.activeStreamId) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  
  // Check if any message content has changed (important for streaming updates)
  if (!equal(prevProps.messages, nextProps.messages)) return false;
  
  return true;
});

Messages.displayName = 'Messages';

export default Messages;
