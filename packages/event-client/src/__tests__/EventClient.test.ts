import { EventsClient } from "../EventClient";

describe("EventClient", () => {
  const client = new EventsClient();
  it("should be defined", () => {
    expect(client).toBeDefined();
  });
});
