import { UIMessage } from "ai";
import { Doc } from "../../../convex/_generated/dataModel";

type Message = Doc<"messages">;

export const convertDBMessageToUIMessage = (message: Message): UIMessage & { streamId?: string } => {
    return {
        id: message._id,
        role: message.role,
        content: message.content,
        parts: message.parts || [{ type: "text", text: message.content }],
        createdAt: new Date(message.createdAt),
        streamId: message.streamId,
    }
}

