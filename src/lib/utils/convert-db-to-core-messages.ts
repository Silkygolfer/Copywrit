import { UIMessage } from "ai";
import { Doc, Id } from "../../../convex/_generated/dataModel";

type Message = Doc<"messages">;

export const convertDBMessageToUIMessage = (message: Message): UIMessage & { streamId: Id<'streams'> }  => {
    return {
        id: message.messageId,
        role: message.role,
        content: message.content,
        parts: message.parts || [{ type: "text", text: message.content }],
        createdAt: new Date(message.createdAt),
        streamId: message.streamId as Id<'streams'>,
    }
}

