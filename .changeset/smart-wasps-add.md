---
"@rocket-science-core/event-client": major
---

Internal tracking of listeners will now be stored by serializing the user provided event type and event key to avoid bug where additional event listeners of the same time are overriden. This is more in line with the way event listeners work in the browser except our implementation allows users to add and remove events by a serializable key. This is a major api change but required.
