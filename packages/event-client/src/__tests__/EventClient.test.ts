import { EventsClient, Event } from "../EventClient";

describe("EventClient", () => {
  const client = new EventsClient();
  it("on method should add event to listeners and window", () => {
    jest
      .spyOn(window, "addEventListener")
      .mockImplementationOnce(
        (
          type: string,
          listener: EventListenerOrEventListenerObject,
          options?: boolean | AddEventListenerOptions
        ) => {
          expect(type).toBe("test");
          expect(listener).toBeInstanceOf(Function);
          expect(options).toBeUndefined();
        }
      );
    client.on("test", "test", () => {});
    client.emit("test", { test: "test" });
    expect(client.getListeners().size).toBe(1);
  });
  it("emit method should dispatch event to window", () => {
    jest
      .spyOn(window, "dispatchEvent")
      // @ts-ignore
      .mockImplementationOnce((event: Event<{ test: "test" }>): boolean => {
        expect(event.type).toBe("test");
        expect(event.detail).toEqual({ test: "test" });
        return true;
      });
    client.emit("test", { test: "test" });
  });
  it("invoke method should invoke event listener", () => {
    jest
      .spyOn(window, "dispatchEvent")
      // @ts-ignore
      .mockImplementationOnce((event: Event<{ test: "test" }>): boolean => {
        expect(event.type).toBe("test");
        expect(event.detail).toEqual({ test: "test" });
        return true;
      });
    client.invoke("test", { test: "test" });
  });
  it("remove method should remove event from listeners and window", () => {
    jest
      .spyOn(window, "removeEventListener")
      .mockImplementationOnce(
        (
          type: string,
          listener: EventListenerOrEventListenerObject,
          options?: boolean | EventListenerOptions
        ) => {
          expect(type).toBe("test");
          expect(listener).toBeInstanceOf(Function);
          expect(options).toBeUndefined();
        }
      );
    client.remove({ type: "test", key: "test" });
    expect(client.getListeners().size).toBe(0);
  });
});
