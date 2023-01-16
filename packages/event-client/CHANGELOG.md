# @rocket-science/event-client

## 0.1.1

### Patch Changes

- 5b4b963: Migrate to new npm org package scope rocket-science.

## 3.0.0

### Major Changes

- 33d96d1: Internal tracking of listeners will now be stored by serializing the user provided event type and event key to avoid bug where additional event listeners of the same time are overriden. This is more in line with the way event listeners work in the browser except our implementation allows users to add and remove events by a serializable key. This is a major api change but required.

## 2.0.0

### Major Changes

- b789b13: ## What is the change

  Safely parse payload schema and attach error object to the event object. This means that users need to handle schema validation errors inside of listeners.

  This change was made to allow users the ability to handle zod schema validation errors rather than blocking a listener function from executing.

## 1.0.2

### Patch Changes

- 52a5794: improve client types such as substitution of `any` types for `unknown` types, return void explicitely from methods, and enhance file comments

## 1.0.1

### Patch Changes

- 81a722f: event client on event schema option should make use of zodschema type and zod listed as option peer dependency
