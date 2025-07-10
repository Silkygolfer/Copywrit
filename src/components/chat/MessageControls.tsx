'use client'
import { useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils/twUtils';
import { Check, Copy } from 'lucide-react';
import { UIMessage } from 'ai';

interface MessageControlsProps {
  threadId: string;
  message: UIMessage;
  content: string;
}

export default function MessageControls({
  threadId,
  message,
  content,
}: MessageControlsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };


  return (
    <div
      className={cn(
        'opacity-0 group-hover:opacity-100 transition-opacity duration-100 flex gap-1',
        {
          'absolute mt-5 right-2': message.role === 'user',
        }
      )}
    >
      <Button variant="ghost" size="icon" onClick={handleCopy}>
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </Button>
    </div>
  );
}
