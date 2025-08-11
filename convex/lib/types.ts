import { v } from "convex/values";

// Provider metadata for message parts
const providerMetadata = v.optional(v.any());

// Text part of a message
const textUIPart = v.object({
  type: v.literal('text'),
  text: v.string(),
  state: v.optional(v.union(v.literal('streaming'), v.literal('done'))),
  providerMetadata,
});

// Reasoning part of a message
const reasoningUIPart = v.object({
  type: v.literal('reasoning'),
  text: v.string(),
  state: v.optional(v.union(v.literal('streaming'), v.literal('done'))),
  providerMetadata,
});

// Source URL part of a message
const sourceUrlUIPart = v.object({
  type: v.literal('source-url'),
  sourceId: v.string(),
  url: v.string(),
  title: v.optional(v.string()),
  providerMetadata,
});

// Source document part of a message
const sourceDocumentUIPart = v.object({
  type: v.literal('source-document'),
  sourceId: v.string(),
  mediaType: v.string(),
  title: v.string(),
  filename: v.optional(v.string()),
  providerMetadata,
});

// File part of a message
const fileUIPart = v.object({
  type: v.literal('file'),
  mediaType: v.string(),
  filename: v.optional(v.string()),
  url: v.string(),
  providerMetadata,
});

// Step start part of a message
const stepStartUIPart = v.object({
  type: v.literal('step-start'),
});

// Dynamic tool part of a message
const dynamicToolUIPart = v.object({
  type: v.literal('dynamic-tool'),
  toolName: v.string(),
  toolCallId: v.string(),
  state: v.union(
    v.literal('input-streaming'),
    v.literal('input-available'),
    v.literal('output-available'),
    v.literal('output-error')
  ),
  input: v.optional(v.any()),
  output: v.optional(v.any()),
  errorText: v.optional(v.string()),
  callProviderMetadata: v.optional(v.any()),
});

// Generic tool part (for typed tools, we use a generic approach)
// This can handle tool-* type patterns
const toolUIPart = v.object({
  type: v.string(), // Will be "tool-{toolName}"
  toolCallId: v.string(),
  state: v.union(
    v.literal('input-streaming'),
    v.literal('input-available'),
    v.literal('output-available'),
    v.literal('output-error')
  ),
  input: v.optional(v.any()),
  output: v.optional(v.any()),
  errorText: v.optional(v.string()),
  providerExecuted: v.optional(v.boolean()),
  callProviderMetadata: v.optional(v.any()),
});

// Generic data part (for data-* type patterns)
const dataUIPart = v.object({
  type: v.string(), // Will be "data-{dataName}"
  id: v.optional(v.string()),
  data: v.any(),
});

// Union of all possible message parts
const messagePart = v.union(
  textUIPart,
  reasoningUIPart,
  sourceUrlUIPart,
  sourceDocumentUIPart,
  fileUIPart,
  stepStartUIPart,
  dynamicToolUIPart,
  toolUIPart,
  dataUIPart
);

// Main DBMessage type for Convex
export const DBMessage = v.object({
  id: v.string(),
  role: v.union(v.literal('system'), v.literal('user'), v.literal('assistant')),
  metadata: v.optional(v.any()), // Metadata can be any type
  parts: v.array(messagePart),
});

// Export individual part types for reuse
export const MessageParts = {
  text: textUIPart,
  reasoning: reasoningUIPart,
  sourceUrl: sourceUrlUIPart,
  sourceDocument: sourceDocumentUIPart,
  file: fileUIPart,
  stepStart: stepStartUIPart,
  dynamicTool: dynamicToolUIPart,
  tool: toolUIPart,
  data: dataUIPart,
};

// Type inference helper for use in TypeScript
export type DBMessageType = typeof DBMessage;