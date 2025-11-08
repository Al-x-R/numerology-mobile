// lib/types/calculation.d.ts
export type MatrixData = {
  [key in '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9']: string;
};

export interface AdditionalParams {
  character: number;
  goal: number;
  energy: string;
  utilityMoney: number;
  interest: string;
  talent: number;
  spirituality: number;
  health: number;
  logic: number;
  habits: number;
  labor: number;
  family: number;
  luck: number;
  selfEsteem: number;
  duty: string;
  memory: number;
  temperament: number;
  destinyNumber: number;
}

export interface CalculationResult {
  matrix: MatrixData;
  workingNumbers: number[];
  additionalParams: AdditionalParams;
}

export interface Interpretation {
  title: string;
  description: string;
  value?: string;
  type: 'matrix' | 'working';
}
