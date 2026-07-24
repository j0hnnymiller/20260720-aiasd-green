import { useKeyboardAdapter } from "../features/calculator/hooks";
import { CalculatorDisplay } from "./CalculatorDisplay";
import { DigitKeypad } from "./DigitKeypad";

export const App = () => {
  useKeyboardAdapter();

  return (
    <main className="calculator" aria-label="Calculator">
      <CalculatorDisplay />
      <DigitKeypad />
    </main>
  );
};
