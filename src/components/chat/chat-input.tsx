'use client'
import { ArrowUpIcon } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils/tw-utils';
import { Button } from '../ui/button';
import useAutoResizeTextarea from '../../hooks/use-auto-resize-textarea';
import { StopIcon } from '../ui/icons';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Id } from '../../../convex/_generated/dataModel';
import { v4 as uuidv4 } from 'uuid';
import { UIMessage } from 'ai';
import { api } from '../../../convex/_generated/api';
import { useAction } from 'convex/react';
import { useBusinessContext } from '@/app/providers/business-provider';

interface ChatInputProps {
  threadId: Id<"threads"> | null;
  onSendMessage: (content: UIMessage) => Promise<void>;
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
  const {businessId} = useBusinessContext()
  const [input, setInput] = useState('');

  // Mutations
  const createThreadAction = useAction(api.threads.createThreadAction);

  const isDisabled = useMemo(
    () => !input.trim() || isLoading,
    [input, isLoading]
  );

  const handleSubmit = useCallback(async () => {
    const currentInput = textareaRef.current?.value || input;
    const messageId = uuidv4() as Id<"messages">;
    if (!currentInput.trim() || isLoading || !user) return;

    if (!threadId) {
      const newThreadId = await createThreadAction({
        title: "New Chat",
        clerkUserId: user?.id,
        businessId: businessId,
        initialMessage: currentInput.trim(),
      });

      const userMessage = {
        id: messageId,
        content: currentInput.trim(),
        role: "user" as const,
        parts: [{ type: 'text', text: currentInput.trim() }],
        createdAt: new Date(),
      };
      
      try {
        localStorage.setItem('initialMessage', JSON.stringify({
          threadId: newThreadId,
          message: userMessage,
          title: "New Chat"
        }));

        router.push(`/chat/${newThreadId}`);
        
        setInput('');
        adjustHeight(true);
        return;
      } catch (error) {
        console.error('Failed to store initial message:', error);
      }
    } 

    if (threadId) {
      try {
        setInput('');
        adjustHeight(true);
        
        const message: UIMessage = {
          id: messageId,
          content: currentInput.trim(),
          role: "user",
          parts: [{ type: 'text', text: currentInput.trim() }],
          createdAt: new Date(),
        };
        onSendMessage(message).catch(error => {
          console.error('Failed to send message:', error);
        });
      } catch (error) {
        console.error('Failed to send message:', error);
      }
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
