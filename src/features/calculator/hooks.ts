import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../app/store";
import {
  dispatchApplyPercent,
  dispatchEnterDigit,
  dispatchEvaluateExpression,
  dispatchSelectOperator,
  dispatchToggleSign,
} from "./commands";
import { selectDisplayValue } from "./queries";
import type { Operator } from "./types";

export const useDisplayValue = (): string => useSelector(selectDisplayValue);

export const useDigitEntry = (): ((digit: string) => void) => {
  const dispatch = useDispatch<AppDispatch>();

  return (digit: string) => {
    dispatchEnterDigit(dispatch, digit);
  };
};

export const useOperatorSelection = (): ((operator: Operator) => void) => {
  const dispatch = useDispatch<AppDispatch>();

  return (operator: Operator) => {
    dispatchSelectOperator(dispatch, operator);
  };
};

export const useEvaluate = (): (() => void) => {
  const dispatch = useDispatch<AppDispatch>();

  return () => {
    dispatchEvaluateExpression(dispatch);
  };
};

export const useToggleSign = (): (() => void) => {
  const dispatch = useDispatch<AppDispatch>();

  return () => {
    dispatchToggleSign(dispatch);
  };
};

export const useApplyPercent = (): (() => void) => {
  const dispatch = useDispatch<AppDispatch>();

  return () => {
    dispatchApplyPercent(dispatch);
  };
};
