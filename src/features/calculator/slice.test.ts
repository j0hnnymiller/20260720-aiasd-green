import { describe, expect, it } from "vitest";
import {
  allClear,
  calculatorReducer,
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

  it("enters readable error state for division by zero", () => {
    let state = calculatorReducer(initialState, enterDigit("5"));
    state = calculatorReducer(state, selectOperator("/"));
    state = calculatorReducer(state, enterDigit("0"));
    state = calculatorReducer(state, evaluateExpression());

    expect(state.phase).toBe("error");
    expect(state.errorMessage).toBe("Cannot divide by zero");
    expect(state.currentEntry).toBe("0");
    expect(state.pendingOperator).toBeNull();
    expect(state.previousValue).toBeNull();
  });

  it("enters error state in chained operation when dividing by zero", () => {
    let state = calculatorReducer(initialState, enterDigit("5"));
    state = calculatorReducer(state, selectOperator("/"));
    state = calculatorReducer(state, enterDigit("0"));
    state = calculatorReducer(state, selectOperator("+"));

    expect(state.phase).toBe("error");
    expect(state.errorMessage).toBe("Cannot divide by zero");
  });

  it("recovers from error state when a valid digit is entered", () => {
    let state = calculatorReducer(initialState, enterDigit("5"));
    state = calculatorReducer(state, selectOperator("/"));
    state = calculatorReducer(state, enterDigit("0"));
    state = calculatorReducer(state, evaluateExpression());
    state = calculatorReducer(state, enterDigit("7"));

    expect(state.phase).toBe("entering");
    expect(state.errorMessage).toBeNull();
    expect(state.currentEntry).toBe("7");
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
