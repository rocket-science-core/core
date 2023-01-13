import { ZodSchema } from "zod";

export class EventsClient<
  Listeners extends Record<string, CustomEvent<any>>,
  Emitters extends Record<string, CustomEvent<any>>
> {
  private events = new Map<keyof Listeners, any>();

  on<EventType extends keyof Listeners>(
    type: EventType,
    listener: (ev: Listeners[EventType]) => any,
    schema?: ZodSchema<any>,
    options?: boolean | AddEventListenerOptions
  ): void {
    const customListener = (event: Listeners[EventType]) => {
      if (schema) {
        schema.parse(event.detail);
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

  remove(type: keyof Listeners): void {
    const listener = this.events.get(type);
    this.events.delete(type);
    window.removeEventListener(type as keyof WindowEventMap, listener);
  }

  emit<EventType extends keyof Emitters>(
    type: EventType,
    ctx: Emitters[EventType]["detail"]
  ) {
    const event = new CustomEvent(type as keyof WindowEventMap, {
      detail: ctx,
    });
    window.dispatchEvent(event);
  }

  invoke<EventType extends keyof Listeners>(
    type: EventType,
    ctx: Listeners[EventType]["detail"]
  ) {
    const event = new CustomEvent(type as keyof WindowEventMap, {
      detail: ctx,
    });
    window.dispatchEvent(event);
  }
}
