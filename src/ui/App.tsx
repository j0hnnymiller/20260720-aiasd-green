import { CalculatorDisplay } from "./CalculatorDisplay";
import { DigitKeypad } from "./DigitKeypad";

export const App = () => {
  return (
    <main className="calculator" aria-label="Calculator">
      <CalculatorDisplay />
      <DigitKeypad />
    </main>
  );
};
