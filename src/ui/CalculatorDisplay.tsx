import { useDisplayValue } from "../features/calculator/hooks";

export const CalculatorDisplay = () => {
  const value = useDisplayValue();

  return (
    <output className="display" aria-live="polite" aria-label="Display">
      {value}
    </output>
  );
};
