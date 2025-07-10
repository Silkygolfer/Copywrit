'use client'
import Chat from '@/components/chat/Chat'
import { useParams } from 'next/navigation'


export default function ChatPage() {
  const { threadId } = useParams<{ threadId: string }>();

  // if no threadId, render error UI
  if (!threadId) {
    return <div>Error: No threadId provided</div>;
  }

  return (
    <div className="h-full bg-copywrit-blue/10">
      <Chat threadId={threadId} clientId='12345'/>
    </div>
  );
}