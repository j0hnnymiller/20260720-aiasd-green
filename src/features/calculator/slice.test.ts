import { describe, expect, it } from "vitest";
import {
  allClear,
  applyPercent,
  calculatorReducer,
  evaluateExpression,
  enterDigit,
  initialState,
  seedEvaluatedResult,
  selectOperator,
  toggleSign,
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

describe("calculator slice - toggleSign", () => {
  it("negates a positive entry", () => {
    let state = calculatorReducer(initialState, enterDigit("5"));
    state = calculatorReducer(state, toggleSign());

    expect(state.currentEntry).toBe("-5");
  });

  it("restores positive value from negative entry", () => {
    let state = calculatorReducer(initialState, enterDigit("5"));
    state = calculatorReducer(state, toggleSign());
    state = calculatorReducer(state, toggleSign());

    expect(state.currentEntry).toBe("5");
  });

  it("does not change zero", () => {
    const state = calculatorReducer(initialState, toggleSign());

    expect(state.currentEntry).toBe("0");
  });

  it("no-ops in error phase", () => {
    const errorState = {
      ...initialState,
      phase: "error" as const,
      errorMessage: "Cannot divide by zero",
      currentEntry: "9",
    };
    const next = calculatorReducer(errorState, toggleSign());

    expect(next.currentEntry).toBe("9");
  });

  it("toggles sign on evaluated result", () => {
    let state = calculatorReducer(initialState, seedEvaluatedResult("42"));
    state = calculatorReducer(state, toggleSign());

    expect(state.currentEntry).toBe("-42");
  });
});

describe("calculator slice - applyPercent", () => {
  it("converts entry to decimal form: 10% => 0.1", () => {
    let state = calculatorReducer(initialState, enterDigit("1"));
    state = calculatorReducer(state, enterDigit("0"));
    state = calculatorReducer(state, applyPercent());

    expect(state.currentEntry).toBe("0.1");
  });

  it("200 + 10% = 200.1", () => {
    let state = calculatorReducer(initialState, enterDigit("2"));
    state = calculatorReducer(state, enterDigit("0"));
    state = calculatorReducer(state, enterDigit("0"));
    state = calculatorReducer(state, selectOperator("+"));
    state = calculatorReducer(state, enterDigit("1"));
    state = calculatorReducer(state, enterDigit("0"));
    state = calculatorReducer(state, applyPercent());
    state = calculatorReducer(state, evaluateExpression());

    expect(state.currentEntry).toBe("200.1");
  });

  it("200 - 10% = 199.9", () => {
    let state = calculatorReducer(initialState, enterDigit("2"));
    state = calculatorReducer(state, enterDigit("0"));
    state = calculatorReducer(state, enterDigit("0"));
    state = calculatorReducer(state, selectOperator("-"));
    state = calculatorReducer(state, enterDigit("1"));
    state = calculatorReducer(state, enterDigit("0"));
    state = calculatorReducer(state, applyPercent());
    state = calculatorReducer(state, evaluateExpression());

    expect(state.currentEntry).toBe("199.9");
  });

  it("200 x 10% = 20", () => {
    let state = calculatorReducer(initialState, enterDigit("2"));
    state = calculatorReducer(state, enterDigit("0"));
    state = calculatorReducer(state, enterDigit("0"));
    state = calculatorReducer(state, selectOperator("x"));
    state = calculatorReducer(state, enterDigit("1"));
    state = calculatorReducer(state, enterDigit("0"));
    state = calculatorReducer(state, applyPercent());
    state = calculatorReducer(state, evaluateExpression());

    expect(state.currentEntry).toBe("20");
  });

  it("200 / 10% = 2000", () => {
    let state = calculatorReducer(initialState, enterDigit("2"));
    state = calculatorReducer(state, enterDigit("0"));
    state = calculatorReducer(state, enterDigit("0"));
    state = calculatorReducer(state, selectOperator("/"));
    state = calculatorReducer(state, enterDigit("1"));
    state = calculatorReducer(state, enterDigit("0"));
    state = calculatorReducer(state, applyPercent());
    state = calculatorReducer(state, evaluateExpression());

    expect(state.currentEntry).toBe("2000");
  });

  it("no-ops in error phase", () => {
    const errorState = {
      ...initialState,
      phase: "error" as const,
      errorMessage: "Cannot divide by zero",
      currentEntry: "9",
    };
    const next = calculatorReducer(errorState, applyPercent());

    expect(next.currentEntry).toBe("9");
  });
});
