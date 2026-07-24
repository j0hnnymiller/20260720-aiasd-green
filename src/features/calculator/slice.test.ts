import { describe, expect, it } from "vitest";
import {
  allClear,
  calculatorReducer,
  clearEntry,
  evaluateExpression,
  enterDigit,
  initialState,
  seedEvaluatedResult,
  selectOperator,
} from "./slice";

describe("calculator slice - enterDigit", () => {
  it("appends sequential digits", () => {
    let state = calculatorReducer(initialState, enterDigit("1"));
    state = calculatorReducer(state, enterDigit("2"));
    state = calculatorReducer(state, enterDigit("3"));

    expect(state.currentEntry).toBe("123");
    expect(state.phase).toBe("entering");
  });

  it("keeps leading zero deterministic by replacing it", () => {
    let state = calculatorReducer(initialState, enterDigit("0"));
    state = calculatorReducer(state, enterDigit("0"));
    state = calculatorReducer(state, enterDigit("7"));

    expect(state.currentEntry).toBe("7");
  });

  it("starts a fresh entry when phase is evaluated and no pending operator exists", () => {
    const evaluated = calculatorReducer(initialState, seedEvaluatedResult("5"));
    const next = calculatorReducer(evaluated, enterDigit("4"));

    expect(next.currentEntry).toBe("4");
    expect(next.phase).toBe("entering");
  });

  it("ignores non-digit input payloads", () => {
    const next = calculatorReducer(initialState, enterDigit("A"));

    expect(next).toEqual(initialState);
  });

  it("resets state with allClear", () => {
    const dirty = calculatorReducer(initialState, enterDigit("9"));
    const cleared = calculatorReducer(dirty, allClear());

    expect(cleared).toEqual(initialState);
  });

  it("executes addition with equals", () => {
    let state = calculatorReducer(initialState, enterDigit("2"));
    state = calculatorReducer(state, selectOperator("+"));
    state = calculatorReducer(state, enterDigit("3"));
    state = calculatorReducer(state, evaluateExpression());

    expect(state.currentEntry).toBe("5");
    expect(state.pendingOperator).toBeNull();
    expect(state.previousValue).toBeNull();
    expect(state.phase).toBe("evaluated");
  });

  it("executes subtraction with equals", () => {
    let state = calculatorReducer(initialState, enterDigit("9"));
    state = calculatorReducer(state, selectOperator("-"));
    state = calculatorReducer(state, enterDigit("1"));
    state = calculatorReducer(state, enterDigit("2"));
    state = calculatorReducer(state, evaluateExpression());

    expect(state.currentEntry).toBe("-3");
  });

  it("executes multiplication with equals", () => {
    let state = calculatorReducer(initialState, enterDigit("7"));
    state = calculatorReducer(state, selectOperator("x"));
    state = calculatorReducer(state, enterDigit("6"));
    state = calculatorReducer(state, evaluateExpression());

    expect(state.currentEntry).toBe("42");
  });

  it("executes division with equals", () => {
    let state = calculatorReducer(initialState, enterDigit("8"));
    state = calculatorReducer(state, selectOperator("/"));
    state = calculatorReducer(state, enterDigit("4"));
    state = calculatorReducer(state, evaluateExpression());

    expect(state.currentEntry).toBe("2");
  });

  it("replaces pending operator deterministically when pressed repeatedly", () => {
    let state = calculatorReducer(initialState, enterDigit("9"));
    state = calculatorReducer(state, selectOperator("+"));
    state = calculatorReducer(state, selectOperator("-"));
    state = calculatorReducer(state, selectOperator("x"));

    expect(state.previousValue).toBe(9);
    expect(state.pendingOperator).toBe("x");
    expect(state.currentEntry).toBe("9");
    expect(state.phase).toBe("evaluated");
  });

  it("supports chaining after an evaluated result", () => {
    let state = calculatorReducer(initialState, seedEvaluatedResult("5"));
    state = calculatorReducer(state, selectOperator("+"));
    state = calculatorReducer(state, enterDigit("4"));
    state = calculatorReducer(state, evaluateExpression());

    expect(state.currentEntry).toBe("9");
    expect(state.pendingOperator).toBeNull();
    expect(state.previousValue).toBeNull();
  });

  it("evaluates sequential operators left to right", () => {
    let state = calculatorReducer(initialState, enterDigit("2"));
    state = calculatorReducer(state, selectOperator("+"));
    state = calculatorReducer(state, enterDigit("3"));
    state = calculatorReducer(state, selectOperator("x"));
    state = calculatorReducer(state, enterDigit("4"));
    state = calculatorReducer(state, evaluateExpression());

    expect(state.currentEntry).toBe("20");
  });
});

describe("calculator slice - clearEntry", () => {
  it("resets current entry to 0 from entering phase", () => {
    let state = calculatorReducer(initialState, enterDigit("5"));
    state = calculatorReducer(state, clearEntry());

    expect(state.currentEntry).toBe("0");
    expect(state.previousValue).toBeNull();
    expect(state.pendingOperator).toBeNull();
    expect(state.phase).toBe("idle");
  });

  it("resets only the current operand and preserves pending operation context", () => {
    let state = calculatorReducer(initialState, enterDigit("9"));
    state = calculatorReducer(state, selectOperator("+"));
    state = calculatorReducer(state, enterDigit("3"));
    state = calculatorReducer(state, clearEntry());

    expect(state.currentEntry).toBe("0");
    expect(state.previousValue).toBe(9);
    expect(state.pendingOperator).toBe("+");
    expect(state.phase).toBe("entering");
  });

  it("allows new operand entry and correct evaluation after clearEntry", () => {
    let state = calculatorReducer(initialState, enterDigit("9"));
    state = calculatorReducer(state, selectOperator("+"));
    state = calculatorReducer(state, enterDigit("3"));
    state = calculatorReducer(state, clearEntry());
    state = calculatorReducer(state, enterDigit("4"));
    state = calculatorReducer(state, evaluateExpression());

    expect(state.currentEntry).toBe("13");
  });

  it("resets to idle from evaluated result phase with no pending operator", () => {
    let state = calculatorReducer(initialState, seedEvaluatedResult("42"));
    state = calculatorReducer(state, clearEntry());

    expect(state.currentEntry).toBe("0");
    expect(state.pendingOperator).toBeNull();
    expect(state.phase).toBe("idle");
  });

  it("transitions to entering phase when clearEntry is applied in evaluated+pending state", () => {
    let state = calculatorReducer(initialState, enterDigit("5"));
    state = calculatorReducer(state, selectOperator("-"));
    state = calculatorReducer(state, clearEntry());

    expect(state.currentEntry).toBe("0");
    expect(state.pendingOperator).toBe("-");
    expect(state.phase).toBe("entering");
  });

  it("does not affect state in error phase", () => {
    const errorState = {
      ...initialState,
      phase: "error" as const,
      errorMessage: "Cannot divide by zero",
      currentEntry: "7",
    };
    const next = calculatorReducer(errorState, clearEntry());

    expect(next).toEqual(errorState);
  });
});

describe("calculator slice - allClear", () => {
  it("resets full expression state from entering phase", () => {
    let state = calculatorReducer(initialState, enterDigit("9"));
    state = calculatorReducer(state, selectOperator("+"));
    state = calculatorReducer(state, enterDigit("3"));
    state = calculatorReducer(state, allClear());

    expect(state).toEqual(initialState);
  });

  it("resets from evaluated result state", () => {
    let state = calculatorReducer(initialState, seedEvaluatedResult("42"));
    state = calculatorReducer(state, allClear());

    expect(state).toEqual(initialState);
  });

  it("resets from error state", () => {
    const errorState = {
      ...initialState,
      phase: "error" as const,
      errorMessage: "Cannot divide by zero",
    };
    const next = calculatorReducer(errorState, allClear());

    expect(next).toEqual(initialState);
  });
});
