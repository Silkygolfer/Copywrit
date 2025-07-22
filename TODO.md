[ ] Create thread title logic
[ ] Create client creation form
[ ] Create new user account onboarding flow
    [ ] Branch logic on single business or multi-business
[ ] Integrate R2 bucket upload for client context assets
[ ] Integrate supermemory connector service for memory context
[ ] Build prompt for copywrit.ai copywriting agent
[ ] Build tool_call logic for memory lookup (supermemory connector)



Streaming Flow:
1. Client submits prompt
2. Client calls useChat append()
    a. Takes {messages}
3. POST call to route.ts
    a. parse out messages
    b. creates streamId
    b. generates streaming HTTP response with streamText
    c. writes chunks to db with streamId
    d. returns streamId and HTTP streaming text response object