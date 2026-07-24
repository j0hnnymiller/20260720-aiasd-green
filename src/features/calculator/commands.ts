import type { AppDispatch } from "../../app/store";
import { allClear, enterDigit, evaluateExpression, selectOperator } from "./slice";
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

export const dispatchAllClear = (dispatch: AppDispatch): void => {
  dispatch(allClear());
};
