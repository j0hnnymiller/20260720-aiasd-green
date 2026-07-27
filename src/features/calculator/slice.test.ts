import { describe, expect, it } from "vitest";
import {
  allClear,
  clearEntry,
  calculatorReducer,
  evaluateExpression,
  enterDecimal,
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

  it("starts a decimal-first entry with a leading zero", () => {
    const state = calculatorReducer(initialState, enterDecimal());

    expect(state.currentEntry).toBe("0.");
    expect(state.phase).toBe("entering");
  });

  it("ignores duplicate decimal points within the active entry", () => {
    let state = calculatorReducer(initialState, enterDigit("1"));
    state = calculatorReducer(state, enterDecimal());
    state = calculatorReducer(state, enterDecimal());
    state = calculatorReducer(state, enterDigit("2"));

    expect(state.currentEntry).toBe("1.2");
  });

  it("starts the next operand with a decimal after an operator", () => {
    let state = calculatorReducer(initialState, enterDigit("9"));
    state = calculatorReducer(state, selectOperator("+"));
    state = calculatorReducer(state, enterDecimal());
    state = calculatorReducer(state, enterDigit("4"));
    state = calculatorReducer(state, evaluateExpression());

    expect(state.currentEntry).toBe("9.4");
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

  it("resets error state with allClear", () => {
    let state = calculatorReducer(initialState, enterDigit("5"));
    state = calculatorReducer(state, selectOperator("/"));
    state = calculatorReducer(state, enterDigit("0"));
    state = calculatorReducer(state, evaluateExpression());

    const cleared = calculatorReducer(state, allClear());

    expect(cleared).toEqual(initialState);
  });

  it("clears only the active entry with clearEntry", () => {
    let state = calculatorReducer(initialState, enterDigit("1"));
    state = calculatorReducer(state, enterDigit("2"));
    state = calculatorReducer(state, enterDigit("3"));
    state = calculatorReducer(state, clearEntry());

    expect(state.currentEntry).toBe("0");
    expect(state.previousValue).toBeNull();
    expect(state.pendingOperator).toBeNull();
    expect(state.phase).toBe("idle");
  });

  it("preserves the pending operation context after clearEntry", () => {
    let state = calculatorReducer(initialState, enterDigit("9"));
    state = calculatorReducer(state, selectOperator("+"));
    state = calculatorReducer(state, enterDigit("4"));
    state = calculatorReducer(state, clearEntry());

    expect(state.currentEntry).toBe("0");
    expect(state.previousValue).toBe(9);
    expect(state.pendingOperator).toBe("+");
    expect(state.phase).toBe("evaluated");

    state = calculatorReducer(state, selectOperator("-"));

    expect(state.currentEntry).toBe("0");
    expect(state.previousValue).toBe(9);
    expect(state.pendingOperator).toBe("-");
    expect(state.phase).toBe("evaluated");
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

  it.each([
    {
      name: "replaces a pending operator when no right-hand operand is committed",
      actions: [enterDigit("9"), selectOperator("+"), selectOperator("-")],
      expected: {
        currentEntry: "9",
        previousValue: 9,
        pendingOperator: "-",
        phase: "evaluated",
      },
    },
    {
      name: "evaluates immediately when a right-hand operand has been committed",
      actions: [
        enterDigit("9"),
        selectOperator("+"),
        enterDigit("3"),
        selectOperator("-"),
      ],
      expected: {
        currentEntry: "12",
        previousValue: 12,
        pendingOperator: "-",
        phase: "evaluated",
      },
    },
    {
      name: "keeps replacement deterministic after a seeded evaluated result",
      actions: [
        seedEvaluatedResult("5"),
        selectOperator("+"),
        selectOperator("x"),
      ],
      expected: {
        currentEntry: "5",
        previousValue: 5,
        pendingOperator: "x",
        phase: "evaluated",
      },
    },
  ])("$name", ({ actions, expected }) => {
    const state = actions.reduce(calculatorReducer, initialState);

    expect(state.currentEntry).toBe(expected.currentEntry);
    expect(state.previousValue).toBe(expected.previousValue);
    expect(state.pendingOperator).toBe(expected.pendingOperator);
    expect(state.phase).toBe(expected.phase);
  });
});
