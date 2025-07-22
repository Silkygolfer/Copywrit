import { ConvexHttpClient } from "convex/browser";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";

export class StreamProcessor {
    private buffer: string = "";
    private streamId: Id<"streams">;
    private convex: ConvexHttpClient;
    private sentenceDelimiters = /[.!?]\s+/;
    private currentStatus: string | null = null;
    private initialized: Promise<void>;
    private hasStartedStreaming: boolean = false;

    constructor(streamId: Id<"streams">, authToken?: string) {
        this.streamId = streamId;
        this.convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
        if (authToken) {
            this.convex.setAuth(authToken);
        }
        
        // Initialize status internally during construction
        this.initialized = this.initializeStatus();
    }

    private async initializeStatus() {
        // Get the current status of the stream
        this.currentStatus = await this.convex.query(api.streaming.getStreamStatus, { streamId: this.streamId });
        
        // Don't update status to "streaming" here - wait until we actually start streaming
        // This allows non-driving clients to see the "pending" status
    }

    private async updateStatus(status: "pending" | "streaming" | "done" | "error" | "timeout") {
        await this.convex.mutation(api.streaming.updateStatus, {
            streamId: this.streamId,
            status,
        });
        this.currentStatus = status;
    }

    async processChunk(text: string) {
        // Ensure initialization is complete before processing
        await this.initialized;
        
        // Update status to "streaming" on the first chunk
        if (!this.hasStartedStreaming && this.currentStatus === "pending") {
            await this.updateStatus("streaming");
            this.hasStartedStreaming = true;
        }
        
        this.buffer += text;

        if (this.sentenceDelimiters.test(this.buffer)) {
            await this.flushCompleteSentences();
        }
    }

    private async flushCompleteSentences() {
        const sentences = this.buffer.split(this.sentenceDelimiters);

        for (let i = 0; i < sentences.length - 1; i++) {
            await this.convex.mutation(api.chunks.writeChunk, {
                streamId: this.streamId,
                text: sentences[i] + ". ",
            });
        }

        this.buffer = sentences[sentences.length - 1];
    }

    async flush() {
        // Ensure initialization is complete before flushing
        await this.initialized;
        
        if (this.buffer.trim()) {
            await this.convex.mutation(api.chunks.writeChunk, {
                streamId: this.streamId,
                text: this.buffer,
            });
        }
        
        // Update status to "done" when all chunks have been processed
        await this.updateStatus("done");
    }
}