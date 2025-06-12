import { useChat } from '@ai-sdk/react';
import Messages from './Messages';
import ChatInput from './ChatInput';
import { UIMessage } from 'ai';
import { v4 as uuidv4 } from 'uuid';


interface ChatProps {
  threadId: string;
  initialMessages: UIMessage[];
}

export default function Chat({ threadId, initialMessages }: ChatProps) {


  const {
    messages,
    input,
    status,
    setInput,
    setMessages,
    append,
    stop,
    reload,
    error,
  } = useChat({
    id: threadId,
    initialMessages,
    experimental_throttle: 50,
    onFinish: async ({ parts }) => {
      const aiMessage: UIMessage = {
        id: uuidv4(),
        parts: parts as UIMessage['parts'],
        role: 'assistant',
        content: '',
        createdAt: new Date(),
      };
      console.log(aiMessage)
    },
  });

  return (
    <div className="relative w-full">
      <main
        className={`flex flex-col w-full max-w-3xl pt-10 pb-44 mx-auto transition-all duration-300 ease-in-out`}
      >
        <Messages
          threadId={threadId}
          messages={messages}
          status={status}
          setMessages={setMessages}
          reload={reload}
          error={error}
          stop={stop}
        />
        <ChatInput
          threadId={threadId}
          input={input}
          status={status}
          append={append}
          setInput={setInput}
          stop={stop}
        />
      </main>
    </div>
  );
}

