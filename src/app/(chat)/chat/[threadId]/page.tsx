import Chat from '@/components/chat/chat'
import { Id } from "../../../../../convex/_generated/dataModel"


export default async function ChatPage({ params }: { params: Promise<{ threadId: Id<"threads"> }> }) {
  const { threadId } = await params;

  return (
    <div className="h-full bg-copywrit-blue/10">
      <Chat threadId={threadId} />
    </div>
  );
}