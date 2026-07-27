import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../app/store";
import {
  dispatchClearEntry,
  dispatchAllClear,
  dispatchEnterDecimal,
  dispatchEnterDigit,
  dispatchEvaluateExpression,
  dispatchSelectOperator,
} from "./commands";
import { selectDisplayValue } from "./queries";
import type { Operator } from "./types";

const DIGIT_KEY_PATTERN = /^\d$/;

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  return target.closest("input, textarea, select, [role='textbox']") !== null;
};

const shouldIgnoreGlobalEnter = (event: KeyboardEvent): boolean => {
  if (event.key !== "Enter") {
    return false;
  }

  if (!(event.target instanceof HTMLElement)) {
    return false;
  }

  return event.target.closest("button, [role='button']") !== null;
};

export const useDisplayValue = (): string => useSelector(selectDisplayValue);

export const useDigitEntry = (): ((digit: string) => void) => {
  const dispatch = useDispatch<AppDispatch>();

  return (digit: string) => {
    dispatchEnterDigit(dispatch, digit);
  };
};

export const useDecimalEntry = (): (() => void) => {
  const dispatch = useDispatch<AppDispatch>();

  return () => {
    dispatchEnterDecimal(dispatch);
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

export const useAllClear = (): (() => void) => {
  const dispatch = useDispatch<AppDispatch>();

  return () => {
    dispatchAllClear(dispatch);
  };
};

export const useClearEntry = (): (() => void) => {
  const dispatch = useDispatch<AppDispatch>();

  return () => {
    dispatchClearEntry(dispatch);
  };
};

export const useKeyboardAdapter = (): void => {
  const enterDigit = useDigitEntry();
  const enterDecimal = useDecimalEntry();
  const selectOperator = useOperatorSelection();
  const evaluateExpression = useEvaluate();
  const allClear = useAllClear();
  const clearEntry = useClearEntry();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        return;
      }

      if (isEditableTarget(event.target)) {
        return;
      }

      if (shouldIgnoreGlobalEnter(event)) {
        return;
      }

      if (DIGIT_KEY_PATTERN.test(event.key)) {
        event.preventDefault();
        enterDigit(event.key);
        return;
      }

      switch (event.key) {
        case ".":
          event.preventDefault();
          enterDecimal();
          return;
        case "+":
        case "-":
        case "/":
          event.preventDefault();
          selectOperator(event.key);
          return;
        case "*":
          event.preventDefault();
          selectOperator("x");
          return;
        case "Enter":
        case "=":
          event.preventDefault();
          evaluateExpression();
          return;
        case "Escape":
          event.preventDefault();
          allClear();
          return;
        case "Delete":
          event.preventDefault();
          clearEntry();
          return;
        default:
          return;
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [
    allClear,
    clearEntry,
    enterDecimal,
    enterDigit,
    evaluateExpression,
    selectOperator,
  ]);
};
