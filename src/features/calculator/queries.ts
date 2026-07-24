import { createSelector } from "reselect";
import type { RootState } from "../../app/store";

const selectCalculatorState = (state: RootState) => state.calculator;

export const selectDisplayValue = createSelector(
  [selectCalculatorState],
  (calculator) => {
    if (calculator.phase === "error" && calculator.errorMessage) {
      return calculator.errorMessage;
    }

    return calculator.currentEntry;
  },
);
