import { ZodSchema, ZodError } from "zod";

export interface Event<T> extends CustomEvent<T> {
  error?: ZodError<T>;
}

type KeyOfMapKey = string | unknown[] | object | number | boolean;

interface MapKey<T> {
  type: T;
  key: KeyOfMapKey;
}

interface MapValue<T> {
  listener: T;
}

type Events = Record<string, Event<unknown>>;

type EventOutput<EventType, SchemaType> = SchemaType extends ZodSchema
  ? EventType
  : Omit<EventType, "error"> & { error: never };

type SchemaType<T> = T extends ZodSchema ? T : never;

/**
 * A client for emitting and listening to events via the window object.
 * @example const client = new EventsClient<Listeners, Emitters>();
 */
export class EventsClient<Listeners extends Events, Emitters extends Events> {
  private listeners = new Map<string, MapValue<unknown>>([]);

  /**
   * Listen to an event. Optionally, provide a `ZodSchema` to validate the event payload.
   * @param type The event type.
   * @param key The event key.
   * @param listener The event listener.
   * @param schema A `ZodSchema` to validate the event payload.
   * @param options The event listener options.
   * @example client.on("addToCart", "someKey", (event) => { console.log(event.detail) });
   */
  on<EventType extends keyof Listeners, Schema>(
    type: EventType,
    key: KeyOfMapKey,
    listener: (event: EventOutput<Listeners[EventType], Schema>) => void,
    schema?: SchemaType<Schema>,
    options?: AddEventListenerOptions
  ): void {
    const customListener: typeof listener = (event) => {
      if (schema) {
        const result = schema.safeParse(event.detail);
        if (!result.success) {
          event.error = result.error;
        }
      }
      listener(event);
    };

    this.listeners.set(this.serializeKey({ type, key }), {
      listener: customListener,
    });

    window.addEventListener(
      type as keyof WindowEventMap,
      customListener as EventListener,
      options
    );
  }

  /**
   * Remove an event listener.
   * @param type The event type.
   * @param key The event key.
   * @example client.remove("addToCart", "someKey");
   */
  remove({ type, key }: MapKey<keyof Listeners>): void {
    const listener = this.listeners.get(this.serializeKey({ type, key }));
    const deleted = this.listeners.delete(this.serializeKey({ type, key }));
    if (deleted) {
      window.removeEventListener(
        type as keyof WindowEventMap,
        listener?.listener as EventListener
      );
    }
  }

  /**
   * Emit an event.
   * @param type The event type.
   * @param ctx The event payload.
   * @example client.emit("addToCart", { id: "someItemId" });
   */
  emit<EventType extends keyof Emitters>(
    type: EventType,
    ctx: Emitters[EventType]["detail"]
  ): void {
    const event = new CustomEvent(type as keyof WindowEventMap, {
      detail: ctx,
    });
    window.dispatchEvent(event);
  }

  /**
   * Invoke a defined `Listener` event. This is functionally equivalent to `emit` but
   * provides type definition for Listeners.
   * @param type The event type.
   * @param ctx The event payload.
   * @example client.invoke("addToCart", { id: "someItemId" });
   */
  invoke<EventType extends keyof Listeners>(
    type: EventType,
    ctx: Listeners[EventType]["detail"]
  ): void {
    const event = new CustomEvent(type as keyof WindowEventMap, {
      detail: ctx,
    });
    window.dispatchEvent(event);
  }

  /**
   * Get all listeners.
   * @returns A `Map` of all listeners.
   * @example const listeners = client.getListeners();
   */
  getListeners() {
    return this.listeners;
  }

  /**
   * Removes all listeners registered in the client.
   * @returns void
   * @example client.removeAll();
   */
  removeAll() {
    this.listeners.forEach((_, key) => {
      this.remove(this.deserializeKey(key));
    });
  }

  /**
   * Serialize a `MapKey` to a string.
   * @param type The event type.
   * @param key The event key.
   * @returns A stringified `MapKey`.
   * @example const serialized = client.serializeKey({ type: "click", key: "button" });
   */
  private serializeKey({ type, key }: MapKey<keyof Listeners>): string {
    return JSON.stringify({ type, key });
  }

  /**
   * Deserialize a stringified `MapKey` to a `MapKey`.
   * @param key A stringified `MapKey`.
   * @returns A `MapKey`.
   * @example const deserialized = client.deserializeKey('{"type":"click","key":"button"}');
   */
  private deserializeKey(key: string): MapKey<keyof Listeners> {
    return JSON.parse(key);
  }
}
