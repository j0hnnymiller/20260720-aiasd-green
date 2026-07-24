export type CalculatorPhase = "idle" | "entering" | "evaluated" | "error";

export type Operator = "+" | "-" | "x" | "/";

export interface CalculatorState {
  currentEntry: string;
  previousValue: number | null;
  pendingOperator: Operator | null;
  phase: CalculatorPhase;
  errorMessage: string | null;
}
