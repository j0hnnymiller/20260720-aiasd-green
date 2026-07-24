import { describe, expect, it } from "vitest";
import type { RootState } from "../../app/store";
import { selectDisplayValue } from "./queries";

const makeState = (overrides: Partial<RootState["calculator"]>): RootState => ({
  calculator: {
    currentEntry: "0",
    previousValue: null,
    pendingOperator: null,
    phase: "idle",
    errorMessage: null,
    ...overrides,
  },
});

describe("selectDisplayValue", () => {
  it("returns current entry during normal phases", () => {
    const state = makeState({ currentEntry: "123", phase: "entering" });

    expect(selectDisplayValue(state)).toBe("123");
  });

  it("returns error message in error phase", () => {
    const state = makeState({
      phase: "error",
      errorMessage: "Cannot divide by zero",
      currentEntry: "9",
    });

    expect(selectDisplayValue(state)).toBe("Cannot divide by zero");
  });

  it("returns evaluated result after arithmetic execution", () => {
    const state = makeState({
      currentEntry: "42",
      previousValue: null,
      pendingOperator: null,
      phase: "evaluated",
    });

    expect(selectDisplayValue(state)).toBe("42");
  });

  it("returns current entry while an operator is pending", () => {
    const state = makeState({
      currentEntry: "12",
      previousValue: 9,
      pendingOperator: "-",
      phase: "entering",
    });

    expect(selectDisplayValue(state)).toBe("12");
  });
});
