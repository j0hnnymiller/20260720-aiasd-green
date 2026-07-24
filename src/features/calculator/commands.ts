import type { AppDispatch } from "../../app/store";
import {
  applyPercent,
  enterDigit,
  evaluateExpression,
  selectOperator,
  toggleSign,
} from "./slice";
import type { Operator } from "./types";

export const dispatchEnterDigit = (
  dispatch: AppDispatch,
  digit: string,
): void => {
  dispatch(enterDigit(digit));
};

export const dispatchSelectOperator = (
  dispatch: AppDispatch,
  operator: Operator,
): void => {
  dispatch(selectOperator(operator));
};

export const dispatchEvaluateExpression = (dispatch: AppDispatch): void => {
  dispatch(evaluateExpression());
};

export const dispatchToggleSign = (dispatch: AppDispatch): void => {
  dispatch(toggleSign());
};

export const dispatchApplyPercent = (dispatch: AppDispatch): void => {
  dispatch(applyPercent());
};
