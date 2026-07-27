import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CalculatorState, Operator } from "./types";

const initialState: CalculatorState = {
  currentEntry: "0",
  previousValue: null,
  pendingOperator: null,
  phase: "idle",
  errorMessage: null,
};

const DIVIDE_BY_ZERO_ERROR = "Cannot divide by zero";

const isDigit = (value: string): value is `${number}` => /^\d$/.test(value);

const appendDigit = (entry: string, digit: string): string => {
  if (entry === "0") {
    return digit;
  }

  return `${entry}${digit}`;
};

const enterDecimalEntry = (state: CalculatorState): void => {
  if (state.currentEntry.includes(".")) {
    return;
  }

  if (state.phase === "error") {
    state.currentEntry = "0.";
    state.previousValue = null;
    state.pendingOperator = null;
    state.errorMessage = null;
    state.phase = "entering";
    return;
  }

  if (state.phase === "evaluated" && state.pendingOperator === null) {
    state.currentEntry = "0.";
    state.phase = "entering";
    return;
  }

  if (state.pendingOperator !== null && state.phase === "evaluated") {
    state.currentEntry = "0.";
    state.phase = "entering";
    return;
  }

  state.currentEntry =
    state.currentEntry === "0" ? "0." : `${state.currentEntry}.`;
  state.phase = "entering";
};

const applyOperation = (
  left: number,
  operator: Operator,
  right: number,
): number | null => {
  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "x":
      return left * right;
    case "/":
      if (right === 0) {
        return null;
      }
      return left / right;
    default:
      return right;
  }
};

const enterErrorState = (state: CalculatorState): void => {
  state.currentEntry = "0";
  state.previousValue = null;
  state.pendingOperator = null;
  state.phase = "error";
  state.errorMessage = DIVIDE_BY_ZERO_ERROR;
};

const calculatorSlice = createSlice({
  name: "calculator",
  initialState,
  reducers: {
    enterDigit: (state, action: PayloadAction<string>) => {
      if (!isDigit(action.payload)) {
        return;
      }

      if (state.phase === "error") {
        state.currentEntry = action.payload;
        state.previousValue = null;
        state.pendingOperator = null;
        state.errorMessage = null;
        state.phase = "entering";
        return;
      }

      if (state.phase === "evaluated" && state.pendingOperator === null) {
        state.currentEntry = action.payload;
        state.phase = "entering";
        return;
      }

      if (state.pendingOperator !== null && state.phase === "evaluated") {
        state.currentEntry = action.payload;
        state.phase = "entering";
        return;
      }

      state.currentEntry = appendDigit(state.currentEntry, action.payload);
      state.phase = "entering";
    },
    enterDecimal: (state) => {
      enterDecimalEntry(state);
    },
    selectOperator: (state, action: PayloadAction<Operator>) => {
      if (state.phase === "error") {
        return;
      }

      const nextOperator = action.payload;
      const currentValue = Number(state.currentEntry);

      if (state.pendingOperator !== null && state.phase === "entering") {
        const leftValue = state.previousValue ?? 0;
        const result = applyOperation(
          leftValue,
          state.pendingOperator,
          currentValue,
        );

        if (result === null) {
          enterErrorState(state);
          return;
        }

        state.currentEntry = String(result);
        state.previousValue = result;
        state.pendingOperator = nextOperator;
        state.phase = "evaluated";
        return;
      }

      if (state.pendingOperator !== null && state.phase === "evaluated") {
        state.pendingOperator = nextOperator;
        return;
      }

      state.previousValue = currentValue;
      state.pendingOperator = nextOperator;
      state.phase = "evaluated";
    },
    evaluateExpression: (state) => {
      if (state.phase === "error") {
        return;
      }

      if (state.pendingOperator === null || state.previousValue === null) {
        state.phase = "evaluated";
        return;
      }

      const rightValue = Number(state.currentEntry);
      const result = applyOperation(
        state.previousValue,
        state.pendingOperator,
        rightValue,
      );

      if (result === null) {
        enterErrorState(state);
        return;
      }

      state.currentEntry = String(result);
      state.previousValue = null;
      state.pendingOperator = null;
      state.phase = "evaluated";
    },
    allClear: () => initialState,
    clearEntry: (state) => {
      if (state.phase === "error") {
        return;
      }

      state.currentEntry = "0";

      if (state.pendingOperator !== null) {
        state.phase = "evaluated";
        return;
      }

      state.phase = "idle";
    },
    seedEvaluatedResult: (state, action: PayloadAction<string>) => {
      state.currentEntry = action.payload;
      state.phase = "evaluated";
      state.errorMessage = null;
    },
  },
});

export const {
  enterDigit,
  enterDecimal,
  selectOperator,
  evaluateExpression,
  allClear,
  clearEntry,
  seedEvaluatedResult,
} = calculatorSlice.actions;
export const calculatorReducer = calculatorSlice.reducer;
export { initialState };
