A lightweight event client that augments DOM events.

<a href="https://bundlephobia.com/package/@rocket-science/event-client@latest" target="\_parent">
<img alt="" src="https://badgen.net/bundlephobia/minzip/@rocket-science/event-client" />
</a>

- [Motivation](#motivation)
- [Usage](#usage)
  - [Basic](#basic)
  - [With Typescript and Zod](#with-typescript-and-zod)
- [API](#api)
- [Examples](#examples)

## Motivation

The event client is primarily built for _decoupled_ communication between **host** and **remote** applications leveraging [module federation](https://webpack.js.org/concepts/module-federation/) to load components from remote locations. However, the event client can be used by any application and does not rely on any particular build system or framework. Rather than relying on a framework specific implementation for passing data to UI components such as [props](https://reactjs.org/docs/components-and-props.html) in React, the event client enables a **framework agnostic** approach by using [custom DOM events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) on the [Window](https://developer.mozilla.org/en-US/docs/Web/API/Window) to pass data between UI components.

While possible, it can be challenging to implement a good type and event payload schema validation system around DOM events. The event client makes this simple!

## Usage

### Basic

Install package in **remote**.

```bash
npm install @rocket-science/event-client

yarn add @rocket-science/event-client

pnpm add @rocket-science/event-client
```

Instantiate new client in **remote**.

```js
import React, { useState, useEffect } from "react";
import { EventsClient } from "@rocket-science/event-client";

const eventsClient = new EventsClient();

export const Cart = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    eventsClient.on(
      "addItemToCart",
      "setToState",
      ({ detail }) => {
        setItems((current) => [detail, ...current]);
        eventsClient.emit("itemAddedToCart", detail);
      }
    );
    return () => {
      eventsClient.remove({ type: "addItemToCart", key: "setToState"});
    };
  }, []);

  return (
    <div>
      {...}
    </div>
  );
};
`;
```

Instantiate new client in **host**.

```js
import React, { useEffect } from "react";
import { ItemList } from "./ItemList";
import { items } from "./items";
import { EventsClient } from "@rocket-science/event-client";
const RemoteCart = React.lazy(() => import("@ahowardtech/checkout/Cart"));

const eventsClient = new EventsClient();

const handleClick = (item) => {
  eventsClient.emit("addItemToCart", item);
};

const App = () => {
  useEffect(() => {
    eventsClient.on("itemAddedToCart", "logToConsole", ({ detail }) => {
      console.log(`Item added to cart: ${detail.price}`);
    });
    return () => {
      eventsClient.remove({ type: "itemAddedToCart", key: "logToConsole" });
    };
  }, []);

  return (
    <div>
      <h1>Ecomm Store</h1>
      <ItemList items={items} handleAddToCart={handleClick} />
      <React.Suspense fallback="loading cart">
        <RemoteCart></RemoteCart>
      </React.Suspense>
    </div>
  );
};

export default App;
```

### With Typescript and Zod

The event client has first class support for Typescript.

To leverage Typescript with a module federation based application, you will first need to install and configure the [FederatedTypesPlugin](https://github.com/module-federation/universe/tree/main/packages/typescript) in both your **remote** and **host**.

Zod is _optional_ but powerful when used in conjuction with the event client.

Define a schema and export types from **remote**.

You can define events by importing the `Event` type and passing the event's payload type.

```ts
import { z } from "zod";
import { Event } from "@rocket-science/event-client";

export const ItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
});

export type Item = z.infer<typeof ItemSchema>;

export type Listeners = {
  addItemToCart: Event<Item>;
  removeItemFromCart: Event<Item>;
};

export type Emitters = {
  itemAddedToCart: Event<Item>;
  itemRemovedFromCart: Event<Item>;
};
```

Pass `Listeners` and `Emitters` types to the event client on instantiation.

```ts
import React, { useState, useEffect } from "react";
import { EventsClient } from "@rocket-science/event-client";
import { Button } from "../Button";
import {
  Listeners as CartListeners,
  Item,
  ItemSchema,
  Emitters as CartEmitters,
} from "./Cart.schema";

const eventsClient = new EventsClient<CartListeners, CartEmitters>();

export const Cart = () => {
  const [items, setItems] = useState<Item[]>([]);

  const handleRemoveButtonClick = (item: Item) => {
    eventsClient.invoke("removeItemFromCart", item);
  };

  useEffect(() => {
    eventsClient.on(
      "addItemToCart",
      "setItemToState",
      ({ detail, error }) => {
        if (error) {
          console.error(error)
        } else {
          setItems((current) => [detail, ...current]);
          eventsClient.emit("itemAddedToCart", detail);
        }
      },
      ItemSchema
    );
    eventsClient.on(
      "removeItemFromCart",
      "remoteItemFromState",
      ({ detail, error }) => {
        if (error) {
          console.error(error)
        } else {
          setItems((current) => {
            const itemIndex = current.findIndex(
              (itemSearched) => itemSearched.id === detail.id
            );
            current.splice(itemIndex, 1);
            return [...current];
          });
          eventsClient.emit("itemRemovedFromCart", detail);
        }
      },
      ItemSchema
    );
    return () => {
      eventsClient.remove("addItemToCart", "setItemToState");
      eventsClient.remove("removeItemFromCart", "removeItemFromState");
    };
  }, []);

  return (
    <div>
      {...}
      <Button
        handleClick={() => handleRemoveButtonClick(item)}
      />
    </div>
  );
};
```

In **host**, instantiate the client and pass the **remote(s)** `Listeners` as the **host** client's `Emitters` and vice versa for the **remote(s)** `Emitters`.

```ts
import React from "react";
import { ItemList } from "./ItemList";
import { items } from "./items";
import { EventsClient } from "@rocket-science/event-client";
import {
  Item,
  Listeners as CartListeners,
  Emitters as CartEmitters,
} from "@ahowardtech/checkout/Cart.schema";
const RemoteCart = React.lazy(() => import("@ahowardtech/checkout/Cart"));

const eventsClient = new EventsClient<CartEmitters, CartListeners>();

const handleClick = (item: Item) => {
  eventsClient.emit("addItemToCart", item);
};

const App = () => {
  useEffect(() => {
    eventsClient.on("itemAddedToCart", "logToConsole", ({ detail }) => {
      console.log(`Item added to cart: ${detail.price}`);
    });
    return () => {
      eventsClient.remove({ type: "itemAddedToCart", key: "logToConsole" });
    };
  }, []);
  return (
    <AppWrapper>
      <h1>Ecomm Store</h1>
      <div className="app-content">
        <ItemList items={items} handleAddToCart={handleClick} />
        <React.Suspense fallback="loading cart">
          <RemoteCart></RemoteCart>
        </React.Suspense>
      </div>
    </AppWrapper>
  );
};

export default App;
```

You may want to define `Listeners` and `Emitters` for your **host**, and you may also have more than one **remote**.

Simply use [Intersection Types](https://www.typescriptlang.org/docs/handbook/2/objects.html#extending-types) to combine them together.

```ts
type HostListeners = CartEmitters & {
  "someHostEvent": Event<{
    message: string
  }>
};

type HostEmitters = CartListeners & SomeOtherRemoteListeners {
  // ...
}

const eventsClient = new EventsClient<HostListeners, HostEmitters>();
```

## API

- `on: (type: EventType, key: KeyOfMapKey, listener: (event: Listeners[EventType]) => void, schema?: ZodSchema<unknown>, options?: AddEventListenerOptions): void`
  - Listen for an event. The event listener will be added to the `window` by calling `window.addEventListener`.
  - The listener is stored internally by the serialization of `{type, key}` where `key` can be any serializable value other than `null`.
  - If `schema` is provided for payload, it will be parsed when the event executes. The `safeParse` method is used, any errors due to parsing are attached to the event object `event.error`. _Note: event.detail payload is gauranteed. Errors should be handled first in listeners._
- `remove: ({type: keyof Listeners, key: KeyOfMapKey})`
  - Event listener will be removed from `window` that matches the provided `type` and `key`.
- `emit: (type: EventType, ctx: Emitters[EventType]["detail"]): void`
  - Emit an event. This will create a `new CustomEvent` and will call `window.dispatchEvent`.
  - The context (`ctx`) of the event is the payload.
- `invoke: (type: EventType, ctx: Listeners[EventType]["detail"]): void`
  - Synonymous in functionality with `emit` but will provide type definitions for emitting a client's Listener.

## Examples

- [E-commerce Cart Remote App](https://github.com/ahoward2/zod-modfed)
