import { Id } from "../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useMemo, useRef, useState } from "react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import { StreamStatus } from "../../convex/schema";

export const useChat = ({
  threadId,
  isDriving,
  streamId,
  businessId,
}: {
  threadId: Id<"threads">;
  isDriving: boolean;
  streamId: Id<"streams">;
  businessId: Id<"businesses">;
}) => {
  const [streamText, setStreamText] = useState("");

  const [streamEnded, setStreamEnded] = useState(null as boolean | null);

  const usePersistence = useMemo(() => {
    if (streamEnded === false) {
      return true;
    }
    if (!isDriving) {
      return true;
    }
    return false;
  }, [isDriving, streamEnded]);

  const persistentText = useQuery(
    api.chunks.getStreamText,
    usePersistence && streamId ? { streamId: streamId } : "skip"
  );

  const streamStarted = useRef(false);

  useEffect(() => {
    if (isDriving && streamId && !streamStarted.current) {
      void (async () => {
        const success = await startStream(threadId, streamId, businessId, (text) =>
          setStreamText((prev) => prev + text)
        );
        setStreamEnded(success);
      })();
      return () => {
        streamStarted.current = true;
      }
    }
  }, [isDriving, streamId, threadId, businessId]);


  const body = useMemo(() => {
    if (persistentText) {
      return persistentText;
    }
    let status: StreamStatus
    if (streamEnded === null) {
        status = streamText.length > 0 ? "streaming" : "pending";
    } else {
        status = streamEnded ? "done" : "error";
    }
    return {
        text: streamText,
        status: status as StreamStatus
    }
  }, [persistentText, streamEnded, streamText]);

  return body;
};

async function startStream(
  threadId: Id<"threads">,
  streamId: Id<"streams">,
  businessId: Id<"businesses">,
  onUpdate: (text: string) => void
) {
  const response = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ threadId, streamId, businessId }),
  });
  if (!response.ok) {
    throw new Error("Failed to create stream");
  }

  if (!response.body) {
    throw new Error("Failed to get body");
  }

  const reader = response.body.getReader();
  if (!reader) {
    throw new Error("Failed to get reader");
  }

  while (true) {
    try {
      const { done, value } = await reader.read();
      const decodedText = new TextDecoder().decode(value, { stream: true });
      console.log("decodedText", decodedText);
      if (done) {
        onUpdate(decodedText);
        return true;
      }
      onUpdate(decodedText);
    } catch (e) {
      console.error("Error reading stream", e);
      return false;
    }
  }
}
