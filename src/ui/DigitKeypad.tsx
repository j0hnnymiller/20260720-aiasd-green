import {
  useClearEntry,
  useAllClear,
  useDecimalEntry,
  useDigitEntry,
  useEvaluate,
  useOperatorSelection,
} from "../features/calculator/hooks";
import type { Operator } from "../features/calculator/types";

const DIGITS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0"];
const OPERATORS: Operator[] = ["+", "-", "x", "/"];

export const DigitKeypad = () => {
  const enterDigit = useDigitEntry();
  const enterDecimal = useDecimalEntry();
  const selectOperator = useOperatorSelection();
  const evaluateExpression = useEvaluate();
  const clearEntry = useClearEntry();
  const allClear = useAllClear();

  return (
    <section className="keypad" aria-label="Calculator keys">
      {DIGITS.map((digit) => (
        <button
          key={digit}
          type="button"
          className="key"
          onClick={() => {
            enterDigit(digit);
          }}
        >
          {digit}
        </button>
      ))}
      <button
        type="button"
        className="key"
        onClick={() => {
          enterDecimal();
        }}
      >
        .
      </button>
      {OPERATORS.map((operator) => (
        <button
          key={operator}
          type="button"
          className="key"
          onClick={() => {
            selectOperator(operator);
          }}
        >
          {operator}
        </button>
      ))}
      <button
        type="button"
        className="key"
        onClick={() => {
          clearEntry();
        }}
      >
        CE
      </button>
      <button
        type="button"
        className="key"
        onClick={() => {
          allClear();
        }}
      >
        AC
      </button>
      <button
        type="button"
        className="key"
        onClick={() => {
          evaluateExpression();
        }}
      >
        =
      </button>
    </section>
  );
};
