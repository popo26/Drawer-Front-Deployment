import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// extends Vitest's expect method with methods from react-testing-library

expect.extend({
  // ... other matchers
  toBeInTheDocument: (received) => {
    const pass = received !== null && received !== undefined;
    return {
      pass,
      message: () =>
        `Expected element ${pass ? "not " : ""}to be in the document`,
    };
  },
});

// runs a cleanup after each test case
afterEach(() => {
  cleanup();
});
