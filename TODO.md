- Add Client Selector Dropdown (CommandSearch Shadcn)
   - StateSetter for Client Context - DONE
   - Fix useReactTable re-render (check Actions column) -> causes freezing when setting businessId in context. - DONE
   - Understand why searching in Combobox breaks after first letter
- Add BusinessId in container tags for added memories to Supermemory - DONE
- Update streaming response to toDataStreamResponse and build data return structure to handle reasoning and tool calls
- Create Tool Call injection -> Allows the model to call tools while being gated to a specific "business" or other types of context as defined in the application logic. Removes the burden of relying on the tool to identify certain tool call keys in the system prompt and provide those to the tool-call (CURRENTLY BROKEN W SUPERMEMORY SEARCH - no businessId being supplied for search at the moment).
- 



