import { ZodSchema, ZodError } from "zod";

export type Event<T> = CustomEvent<T> & {
  error?: ZodError<Partial<T>>;
};

/**
 * A client for emitting and listening to events via the window object.
 * @example const client = new EventsClient();
 */
export class EventsClient<
  Listeners extends Record<string, Event<unknown>>,
  Emitters extends Record<string, Event<unknown>>
> {
  private events = new Map<keyof Listeners, unknown>();

  /**
   * Listen to an event. Optionally, provide a `ZodSchema` to validate the event payload.
   */
  on<EventType extends keyof Listeners>(
    type: EventType,
    listener: (event: Listeners[EventType]) => void,
    schema?: ZodSchema,
    options?: AddEventListenerOptions
  ): void {
    const customListener: typeof listener = (event: Listeners[EventType]) => {
      if (schema) {
        const result = schema.safeParse(event.detail);
        if (!result.success) {
          event.error = result.error;
        }
      }
      listener(event);
    };

    this.events.set(type, customListener);

    window.addEventListener(
      type as keyof WindowEventMap,
      customListener as EventListener,
      options
    );
  }

  /**
   * Remove an event listener.
   */
  remove(type: keyof Listeners): void {
    const listener = this.events.get(type);
    this.events.delete(type);
    window.removeEventListener(
      type as keyof WindowEventMap,
      listener as EventListenerOrEventListenerObject
    );
  }

  /**
   * Emit an event.
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
}
