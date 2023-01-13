A lightweight event client that augments DOM events.

- [Motivation](#motivation)
- [Usage](#usage)
  - [Basic](#basic)
  - [With Typescript and Zod](#with-typescript-and-zod)

## Motivation

This client is primarily built for decoupled communication between **host** and **remote** applications leveraging [module federation](https://webpack.js.org/concepts/module-federation/) to load components from remote locations. However, it can be used by any application and does not rely on any particular build system or framework (one of the core ideas behind module federation).

## Usage

### Basic

Install package in **remote**.

```bash
npm install @rocket-science-core/event-client

yarn add @rocket-science-core/event-client

pnpm add @rocket-science-core/event-client
```

Instantiate new client in **remote**.

```js
import React, { useState, useEffect } from "react";
import { EventsClient } from "@rocket-science-core/event-client";

const eventsClient = new EventsClient();

export const Cart = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    eventsClient.on(
      "addItemToCart",
      ({ detail }) => {
        setItems((current) => [detail, ...current]);
        eventsClient.emit("itemAddedToCart", detail);
      }
    );
    return () => {
      eventsClient.remove("addItemToCart");
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
import React from "react";
import { ItemList } from "./ItemList";
import { items } from "./items";
import { EventsClient } from "@rocket-science-core/event-client";
const RemoteCart = React.lazy(() => import("@ahowardtech/checkout/Cart"));

const eventsClient = new EventsClient();

const handleClick = (item) => {
  eventsClient.emit("addItemToCart", item);
};

const App = () => {
  eventsClient.on("itemAddedToCart", ({ detail }) => {
    console.log(`Item added to cart: ${detail.price}`);
  });
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

```ts
import { z } from "zod";

export const ItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
});

export type Item = z.infer<typeof ItemSchema>;

export type Listeners = {
  addItemToCart: CustomEvent<Item>;
  removeItemFromCart: CustomEvent<Item>;
};

export type Emitters = {
  itemAddedToCart: CustomEvent<Item>;
  itemRemovedFromCart: CustomEvent<Item>;
};
```

Pass `Listeners` and `Emitters` types to the event client on instantiation.

```ts
import React, { useState, useEffect } from "react";
import { EventsClient } from "@rocket-science-core/event-client";
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
      ({ detail }) => {
        setItems((current) => [detail, ...current]);
        eventsClient.emit("itemAddedToCart", detail);
      },
      ItemSchema
    );
    eventsClient.on(
      "removeItemFromCart",
      ({ detail }) => {
        setItems((current) => {
          const itemIndex = current.findIndex(
            (itemSearched) => itemSearched.id === detail.id
          );
          current.splice(itemIndex, 1);
          return [...current];
        });
        eventsClient.emit("itemRemovedFromCart", detail);
      },
      ItemSchema
    );
    return () => {
      eventsClient.remove("addItemToCart");
      eventsClient.remove("removeItemFromCart");
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
import { EventsClient } from "@rocket-science-core/event-client";
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
  eventsClient.on("itemAddedToCart", ({ detail }) => {
    console.log(`Item added to cart: ${detail.price}`);
  });
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
  "someHostEvent": CustomEvent<{
    message: string
  }>
};

type HostEmitters = CartListeners & SomeOtherRemoteListeners {
  // ...
}

const eventsClient = new EventsClient<HostListeners, HostEmitters>();
```
