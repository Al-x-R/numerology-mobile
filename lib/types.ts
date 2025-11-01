// lib/types.d.ts

// A type for a matrix object where the key is a digit (1-9) and the value is a string (e.g., "111")
export type MatrixData = {
  [key in '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9']: string;
};

export interface AdditionalParams {
  // Ячейка 1
  character: number;      // Характер / Воля
  goal: number;           // Цель (Часто совпадает с Character)
  // Ячейка 2
  energy: string;         // Энергия / Биополе. Возвращает '222', '2', '—'
  utilityMoney: number;   // Быт/Деньги (Также связано с Энергией)
  // Ячейка 3
  interest: string;       // Интерес / Наука. Возвращает '33', '3', '—'
  talent: number;         // Талант (Также связано с Interest)
  spirituality: number;   // Духовность (Также связано с Interest)
  // Ячейка 4
  health: number;         // Здоровье
  // Ячейка 5
  logic: number;          // Логика / Интуиция
  habits: number;         // Привычки (Также связано с Logic)
  // Ячейка 6
  labor: number;          // Труд / Мастерство
  family: number;         // Семья (Также связано с Labor)
  // Ячейка 7
  luck: number;           // Удача
  selfEsteem: number;     // Самооценка (Также связано с Luck)
  // Ячейка 8
  duty: string;           // Долг / Терпимость. Возвращает '88', '8', '—'
  // Ячейка 9
  memory: number;         // Память / Интеллект
  // Дополнительные вычисляемые параметры
  temperament: number;    // Темперамент (Диагональ 3+5+7)
  destinyNumber: number;  // Число Судьбы (Второе рабочее число)
}

// Result of full calculation
export interface CalculationResult {
  matrix: MatrixData;
  workingNumbers: number[];
  additionalParams: AdditionalParams;
}

// Interpretation for one cell
export interface Interpretation {
  title: string;
  description: string;
  value?: string;
  type: 'matrix' | 'working';
}
