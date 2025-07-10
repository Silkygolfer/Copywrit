'use client'
import { ArrowUpIcon } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils/twUtils';
import { Button } from '../ui/button';
import useAutoResizeTextarea from '../../hooks/useAutoResizeTextArea';
import { useChat } from '@ai-sdk/react';
import { toast } from 'sonner';

interface SendButtonProps {
  onSubmit: () => void;
  disabled: boolean;
  isLoading?: boolean;
}

function PureInitialChatInput() {
  const router = useRouter();

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 72,
    maxHeight: 200,
  });

  const { input, setInput, append, status } = useChat({
    api: '/api/chat',
    onResponse: (response) => {
      // Get threadId from response headers and navigate
      const threadId = response.headers.get('X-Thread-ID');
      if (threadId) {
        router.push(`/chat/${threadId}`);
      }
    },
    onError: (error) => {
      console.error('Chat error:', error);
      toast.error('Failed to send message');
    },
  });

  const handleSubmit = useCallback(async () => {
    const currentInput = textareaRef.current?.value || input;
    
    if (!currentInput.trim()) {
      return;
    }

    try {
      await append({
        content: currentInput.trim(),
        role: 'user',
      });
      
      // Clear input after successful submission
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.value = '';
      }
      adjustHeight(true);
      
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
    }
  }, [input, append, textareaRef, adjustHeight, setInput]);

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

  const isDisabled = !input.trim() || status === 'streaming' || status === 'submitted';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
      <div className="bg-copywrit-blue/10 backdrop-blur-sm rounded-2xl shadow-xl border border-copywrit-cream/20 p-4 hover:cursor-text hover:border-copywrit-cream/40 transition-all duration-150">
        <div className="relative">
          <div className="flex flex-col">
            <div className="rounded-2xl overflow-y-auto max-h-[300px]">
              <Textarea
                id="chat-input"
                value={input}
                placeholder="What can I help you write today?"
                className={cn(
                  'w-full px-5 py-4 border-none shadow-copywrit-cream text-copywrit-cream',
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
                disabled={status === 'streaming' || status === 'submitted'}
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
                <SendButton 
                  onSubmit={handleSubmit} 
                  disabled={isDisabled} 
                  isLoading={status === 'streaming' || status === 'submitted'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const InitialChatInput = memo(PureInitialChatInput);

const PureSendButton = ({ onSubmit, disabled, isLoading }: SendButtonProps) => {
  return (
    <Button
      onClick={onSubmit}
      variant="default"
      size="icon"
      disabled={disabled}
      className="bg-copywrit-cream hover:bg-copywrit-cream/80 shadow-lg border-0 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Send message"
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-copywrit-blue border-t-transparent" />
      ) : (
        <ArrowUpIcon size={18} />
      )}
    </Button>
  );
};

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  return prevProps.disabled === nextProps.disabled && prevProps.isLoading === nextProps.isLoading;
});

export default InitialChatInput;
