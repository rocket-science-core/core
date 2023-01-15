---
"@rocket-science-core/event-client": major
---

## What is the change

Safely parse payload schema and attach error object to the event object. This means that users need to handle schema validation errors inside of listeners.

This change was made to allow users the ability to handle zod schema validation errors rather than blocking a listener function from executing.
