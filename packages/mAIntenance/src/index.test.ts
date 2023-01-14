import { testFunction } from ".";

describe("testFunction", () => {
  it("should log to console once", () => {
    expect(testFunction("hello")).toBe("hello");
  });
});
