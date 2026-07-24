import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../app/store";
import {
  dispatchEnterDigit,
  dispatchEvaluateExpression,
  dispatchSelectOperator,
} from "./commands";
import { selectDisplayValue } from "./queries";
import type { Operator } from "./types";

const OPERATOR_KEY_MAP: Record<string, Operator> = {
  "+": "+",
  "-": "-",
  "*": "x",
  "/": "/",
};

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

export const useKeyboardAdapter = (): void => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;

      if (/^\d$/.test(key)) {
        dispatchEnterDigit(dispatch, key);
        return;
      }

      if (key in OPERATOR_KEY_MAP) {
        dispatchSelectOperator(dispatch, OPERATOR_KEY_MAP[key]);
        return;
      }

      if (key === "Enter" || key === "=") {
        dispatchEvaluateExpression(dispatch);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch]);
};
