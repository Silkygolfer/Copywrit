'use client'
import { memo } from 'react';
import SimpleMarkdown from './simple-markdown';
import { cn } from '@/lib/utils/tw-utils';
import equal from 'fast-deep-equal';
import MessageControls from './message-controls';
import MessageReasoning from './message-reasoning';
import { MessageToolInvocation } from './message-tool-invocation';
import { Id } from '../../../convex/_generated/dataModel';
import { UIMessage } from 'ai';

function PureMessage({
  threadId,
  message,
  registerRef,
  sentMessageIds,
}: {
  threadId: Id<"threads">;
  message: UIMessage & { streamId: Id<'streams'> };
  registerRef: (id: string, ref: HTMLDivElement | null) => void;
  sentMessageIds: Set<string>;
}) {
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
          if (message.role === 'user') {
            return (
              <div
                key={key}
                className="relative group px-5 py-4 rounded-2xl bg-copywrit-navy text-copywrit-cream shadow-lg border border-copywrit-cream/20 max-w-[80%] ml-auto"
                ref={(el) => registerRef(message.id, el)}
              >
                <div className="mb-2">
                  {part.text}
                </div>
                <MessageControls
                  threadId={threadId}
                  content={part.text}
                  message={message}
                />
              </div>
            );
          } else {
            // Assistant message - render from database
            return (
              <div key={key} className="group flex flex-col gap-3 w-full">
                <div className="bg-transparent text-copywrit-cream rounded-2xl p-5 max-w-[85%]">
                  <SimpleMarkdown content={part.text} />
                </div>
                <MessageControls
                  threadId={threadId}
                  content={part.text}
                  message={message}
                />
              </div>
            );
          }
        }
      })}
    </div>
  );
}

const PreviewMessage = memo(PureMessage, (prevProps, nextProps) => {
  if (prevProps.message.id !== nextProps.message.id) return false;
  if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;
  if (prevProps.sentMessageIds.has(prevProps.message.id) !== nextProps.sentMessageIds.has(nextProps.message.id)) return false;
  return true;
});

PreviewMessage.displayName = 'PreviewMessage';

export default PreviewMessage;
