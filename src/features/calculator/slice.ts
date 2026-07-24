import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CalculatorState, Operator } from "./types";

const initialState: CalculatorState = {
  currentEntry: "0",
  previousValue: null,
  pendingOperator: null,
  phase: "idle",
  errorMessage: null,
};

const isDigit = (value: string): value is `${number}` => /^\d$/.test(value);

const appendDigit = (entry: string, digit: string): string => {
  if (entry === "0") {
    return digit;
  }

  return `${entry}${digit}`;
};

const applyOperation = (
  left: number,
  operator: Operator,
  right: number,
): number => {
  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "x":
      return left * right;
    case "/":
      return left / right;
    default:
      return right;
  }
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

      state.currentEntry = String(result);
      state.previousValue = null;
      state.pendingOperator = null;
      state.phase = "evaluated";
    },
    clearEntry: (state) => {
      if (state.phase === "error") {
        return;
      }

      state.currentEntry = "0";

      if (state.pendingOperator !== null) {
        state.phase = "evaluated";
      } else {
        state.phase = "idle";
      }
    },
    allClear: () => initialState,
    seedEvaluatedResult: (state, action: PayloadAction<string>) => {
      state.currentEntry = action.payload;
      state.phase = "evaluated";
      state.errorMessage = null;
    },
  },
});

export const {
  enterDigit,
  selectOperator,
  evaluateExpression,
  clearEntry,
  allClear,
  seedEvaluatedResult,
} = calculatorSlice.actions;
export const calculatorReducer = calculatorSlice.reducer;
export { initialState };
