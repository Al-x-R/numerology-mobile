// lib/types.ts

// A type for a matrix object where the key is a digit (1-9) and the value is a string (e.g., "111")
export type MatrixData = {
  [key in '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9']: string;
};

// Result of full calculation
export interface CalculationResult {
  matrix: MatrixData;
  workingNumbers: number[];
}

// Interpretation for one cell
export interface Interpretation {
  title: string;
  description: string;
}
