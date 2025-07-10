'use client'
import { ArrowUpIcon } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils/twUtils';
import { Button } from '../ui/button';
import useAutoResizeTextarea from '../../hooks/useAutoResizeTextArea';
import { nanoid } from 'nanoid';
import { StopIcon } from '../ui/icons';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

interface ChatInputProps {
  threadId?: string;
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
}

interface SendButtonProps {
  onSubmit: () => void;
  disabled: boolean;
}


function PureChatInput({
  threadId,
  onSendMessage,
  isLoading,
}: ChatInputProps) {

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 72,
    maxHeight: 200,
  });

  const router = useRouter();
  const {user} = useUser();
  const [input, setInput] = useState('');

  const isDisabled = useMemo(
    () => !input.trim() || isLoading || !user,
    [input, isLoading, user]
  );

  const handleSubmit = useCallback(async () => {
    const currentInput = textareaRef.current?.value || input;

    if (!currentInput.trim() || isLoading || !user) return;

    const messageId = nanoid();

    if (!threadId) {
      // For new threads: store message in session storage and navigate
      const newThreadId = nanoid();
      const userMessage = {
        id: messageId,
        content: currentInput.trim(),
        role: "user" as const,
        parts: [{ type: 'text', text: currentInput.trim() }],
        createdAt: new Date(),
      };
      
      try {
        // Store initial message in session storage for the new page
        sessionStorage.setItem('initialMessage', JSON.stringify({
          threadId: newThreadId,
          message: userMessage,
          title: currentInput.substring(0, 50) || "New Chat"
        }));
        
        setInput('');
        adjustHeight(true);
        // Navigate immediately - new page will handle thread creation and streaming
        router.push(`/chat/${newThreadId}`);
        return;
      } catch (error) {
        console.error('Failed to store initial message:', error);
      }
    } 
    // For existing threads: use the new onSendMessage callback
    try {
      // Clear input immediately for better UX
      setInput('');
      adjustHeight(true);
      
      // Send message (don't await to avoid blocking UI)
      onSendMessage(currentInput.trim()).catch(error => {
        console.error('Failed to send message:', error);
        // Could restore input on error if needed
        // setInput(currentInput.trim());
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [
    input,
    isLoading,
    setInput,
    adjustHeight,
    onSendMessage,
    textareaRef,
    threadId,
    router,
    user,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustHeight();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 p-4">
      <div className="bg-copywrit-blue/10 backdrop-blur-sm rounded-2xl shadow-xl border border-copywrit-cream/20 p-4 hover:cursor-text hover:border-copywrit-cream/40 transition-all duration-150">
        <div className="relative">
          <div className="flex flex-col">
            <div className="rounded-2xl overflow-y-auto max-h-[300px]">
              <Textarea
                id="chat-input"
                value={input}
                placeholder="What can I help you write today?"
                className={cn(
                  'w-full px-5 py-4 border-none shadow-copywrit-cream text-copywrit-cream  ',
                  'placeholder:text-copywrit-cream/70 resize-none',
                  'focus-visible:ring-0 focus-visible:ring-offset-0',
                  'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#a8dadc]/40',
                  'scrollbar-thumb-rounded-full',
                  'min-h-[72px] text-sm sm:text-base leading-relaxed',
                  'dark:bg-transparent'
                )}
                ref={textareaRef}
                onKeyDown={handleKeyDown}
                onChange={handleInputChange}
                aria-label="Chat message input"
                aria-describedby="chat-input-description"
              />
              <span id="chat-input-description" className="sr-only">
                Press Enter to send, Shift+Enter for new line
              </span>
            </div>

            <div className="h-16 flex items-center justify-between px-2 pt-3">
              <div className="text-xs text-copywrit-cream/70">
                Press Enter to send, Shift+Enter for new line
              </div>
              <div className="flex items-center gap-2">
                {isLoading ? (
                  <StopButton />
                ) : (
                  <SendButton onSubmit={handleSubmit} disabled={isDisabled} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ChatInput = memo(PureChatInput, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.threadId !== nextProps.threadId) return false;
  return true;
});

function PureStopButton() {
  return (
    <Button
      variant="outline"
      size="icon"
      className="border-copywrit-red! text-copywrit-red! hover:bg-copywrit-red/20! shadow-sm"
      aria-label="Stop generating response"
    >
      <StopIcon size={20} />
    </Button>
  );
}

const StopButton = memo(PureStopButton);

const PureSendButton = ({ onSubmit, disabled }: SendButtonProps) => {
  return (
    <Button
      onClick={onSubmit}
      variant="default"
      size="icon"
      disabled={disabled}
      className="bg-copywrit-cream hover:bg-copywrit-cream/80 shadow-lg border-0 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Send message"
    >
      <ArrowUpIcon size={18} />
    </Button>
  );
};

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  return prevProps.disabled === nextProps.disabled;
});

export default ChatInput;
