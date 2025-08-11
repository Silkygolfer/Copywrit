import { UIMessage } from "ai";
import { Infer } from "convex/values";
import { DBMessage } from "./types";

/**
 * Convert a DBMessage (Convex database format) to UIMessage (AI SDK format)
 */
export function dbMessageToUIMessage(dbMessage: Infer<typeof DBMessage>): UIMessage {
  return {
    id: dbMessage.id,
    role: dbMessage.role as UIMessage['role'],
    metadata: dbMessage.metadata,
    parts: dbMessage.parts.map(part => convertDBPartToUIPart(part)),
  };
}

/**
 * Convert a UIMessage (AI SDK format) to DBMessage (Convex database format)
 */
export function uiMessageToDBMessage(uiMessage: UIMessage): Infer<typeof DBMessage> {
  return {
    id: uiMessage.id,
    role: uiMessage.role,
    metadata: uiMessage.metadata,
    parts: uiMessage.parts.map(part => convertUIPartToDBPart(part)),
  };
}

/**
 * Convert multiple DBMessages to UIMessages
 */
export function dbMessagesToUIMessages(dbMessages: Infer<typeof DBMessage>[]): UIMessage[] {
  return dbMessages.map(dbMessageToUIMessage);
}

/**
 * Convert multiple UIMessages to DBMessages
 */
export function uiMessagesToDBMessages(uiMessages: UIMessage[]): Infer<typeof DBMessage>[] {
  return uiMessages.map(uiMessageToDBMessage);
}

/**
 * Convert a DB message part to a UI message part
 */
function convertDBPartToUIPart(part: any): any {
  // The structure is already compatible, just ensure type safety
  switch (part.type) {
    case 'text':
      return {
        type: 'text',
        text: part.text,
        state: part.state,
        providerMetadata: part.providerMetadata,
      };
    
    case 'reasoning':
      return {
        type: 'reasoning',
        text: part.text,
        state: part.state,
        providerMetadata: part.providerMetadata,
      };
    
    case 'source-url':
      return {
        type: 'source-url',
        sourceId: part.sourceId,
        url: part.url,
        title: part.title,
        providerMetadata: part.providerMetadata,
      };
    
    case 'source-document':
      return {
        type: 'source-document',
        sourceId: part.sourceId,
        mediaType: part.mediaType,
        title: part.title,
        filename: part.filename,
        providerMetadata: part.providerMetadata,
      };
    
    case 'file':
      return {
        type: 'file',
        mediaType: part.mediaType,
        filename: part.filename,
        url: part.url,
        providerMetadata: part.providerMetadata,
      };
    
    case 'step-start':
      return {
        type: 'step-start',
      };
    
    case 'dynamic-tool':
      const dynamicToolPart: any = {
        type: 'dynamic-tool',
        toolName: part.toolName,
        toolCallId: part.toolCallId,
        state: part.state,
      };
      
      // Add fields based on state
      if (part.state === 'input-streaming' || part.state === 'input-available') {
        dynamicToolPart.input = part.input;
      }
      
      if (part.state === 'output-available') {
        dynamicToolPart.input = part.input;
        dynamicToolPart.output = part.output;
      }
      
      if (part.state === 'output-error') {
        dynamicToolPart.input = part.input;
        dynamicToolPart.errorText = part.errorText;
      }
      
      if (part.callProviderMetadata) {
        dynamicToolPart.callProviderMetadata = part.callProviderMetadata;
      }
      
      return dynamicToolPart;
    
    default:
      // Handle tool-* and data-* patterns
      if (part.type.startsWith('tool-')) {
        const toolPart: any = {
          type: part.type,
          toolCallId: part.toolCallId,
          state: part.state,
        };
        
        // Add fields based on state
        if (part.state === 'input-streaming' || part.state === 'input-available') {
          toolPart.input = part.input;
          if (part.providerExecuted !== undefined) {
            toolPart.providerExecuted = part.providerExecuted;
          }
        }
        
        if (part.state === 'output-available') {
          toolPart.input = part.input;
          toolPart.output = part.output;
          if (part.providerExecuted !== undefined) {
            toolPart.providerExecuted = part.providerExecuted;
          }
        }
        
        if (part.state === 'output-error') {
          toolPart.input = part.input;
          toolPart.errorText = part.errorText;
          if (part.providerExecuted !== undefined) {
            toolPart.providerExecuted = part.providerExecuted;
          }
        }
        
        if (part.callProviderMetadata) {
          toolPart.callProviderMetadata = part.callProviderMetadata;
        }
        
        return toolPart;
      }
      
      if (part.type.startsWith('data-')) {
        return {
          type: part.type,
          id: part.id,
          data: part.data,
        };
      }
      
      // Fallback for any unknown types
      return part;
  }
}

/**
 * Convert a UI message part to a DB message part
 */
function convertUIPartToDBPart(part: any): any {
  // The structure is already compatible, just ensure it matches our schema
  switch (part.type) {
    case 'text':
      return {
        type: 'text',
        text: part.text,
        state: part.state,
        providerMetadata: part.providerMetadata,
      };
    
    case 'reasoning':
      return {
        type: 'reasoning',
        text: part.text,
        state: part.state,
        providerMetadata: part.providerMetadata,
      };
    
    case 'source-url':
      return {
        type: 'source-url',
        sourceId: part.sourceId,
        url: part.url,
        title: part.title,
        providerMetadata: part.providerMetadata,
      };
    
    case 'source-document':
      return {
        type: 'source-document',
        sourceId: part.sourceId,
        mediaType: part.mediaType,
        title: part.title,
        filename: part.filename,
        providerMetadata: part.providerMetadata,
      };
    
    case 'file':
      return {
        type: 'file',
        mediaType: part.mediaType,
        filename: part.filename,
        url: part.url,
        providerMetadata: part.providerMetadata,
      };
    
    case 'step-start':
      return {
        type: 'step-start',
      };
    
    case 'dynamic-tool':
      const dynamicToolPart: any = {
        type: 'dynamic-tool',
        toolName: part.toolName,
        toolCallId: part.toolCallId,
        state: part.state,
      };
      
      // Add optional fields if present
      if (part.input !== undefined) {
        dynamicToolPart.input = part.input;
      }
      
      if (part.output !== undefined) {
        dynamicToolPart.output = part.output;
      }
      
      if (part.errorText !== undefined) {
        dynamicToolPart.errorText = part.errorText;
      }
      
      if (part.callProviderMetadata !== undefined) {
        dynamicToolPart.callProviderMetadata = part.callProviderMetadata;
      }
      
      return dynamicToolPart;
    
    default:
      // Handle tool-* patterns
      if (part.type.startsWith('tool-')) {
        const toolPart: any = {
          type: part.type,
          toolCallId: part.toolCallId,
          state: part.state,
        };
        
        // Add optional fields if present
        if (part.input !== undefined) {
          toolPart.input = part.input;
        }
        
        if (part.output !== undefined) {
          toolPart.output = part.output;
        }
        
        if (part.errorText !== undefined) {
          toolPart.errorText = part.errorText;
        }
        
        if (part.providerExecuted !== undefined) {
          toolPart.providerExecuted = part.providerExecuted;
        }
        
        if (part.callProviderMetadata !== undefined) {
          toolPart.callProviderMetadata = part.callProviderMetadata;
        }
        
        return toolPart;
      }
      
      // Handle data-* patterns
      if (part.type.startsWith('data-')) {
        const dataPart: any = {
          type: part.type,
          data: part.data,
        };
        
        if (part.id !== undefined) {
          dataPart.id = part.id;
        }
        
        return dataPart;
      }
      
      // Fallback for any unknown types
      return part;
  }
}

/**
 * Validate if an object is a valid DBMessage
 */
export function isValidDBMessage(obj: any): obj is Infer<typeof DBMessage> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    ['system', 'user', 'assistant'].includes(obj.role) &&
    Array.isArray(obj.parts)
  );
}

/**
 * Validate if an object is a valid UIMessage
 */
export function isValidUIMessage(obj: any): obj is UIMessage {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    ['system', 'user', 'assistant'].includes(obj.role) &&
    Array.isArray(obj.parts)
  );
}

/**
 * Safe conversion with error handling
 */
export function safeDBMessageToUIMessage(dbMessage: any): UIMessage | null {
  try {
    if (!isValidDBMessage(dbMessage)) {
      console.error('Invalid DBMessage format');
      return null;
    }
    return dbMessageToUIMessage(dbMessage);
  } catch (error) {
    console.error('Error converting DBMessage to UIMessage:', error);
    return null;
  }
}

/**
 * Safe conversion with error handling
 */
export function safeUIMessageToDBMessage(uiMessage: any): Infer<typeof DBMessage> | null {
  try {
    if (!isValidUIMessage(uiMessage)) {
      console.error('Invalid UIMessage format');
      return null;
    }
    return uiMessageToDBMessage(uiMessage);
  } catch (error) {
    console.error('Error converting UIMessage to DBMessage:', error);
    return null;
  }
}