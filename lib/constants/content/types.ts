export interface CompatibilityTexts {
  lpAnalysis: Record<string, {
    title: string;
    strengths: string;
    challenges: string;
    focus: string;
  }>;
  destinyAnalysis: Record<string, {
    overview: string;
    mission: string;
    purpose: string;
    summary: string;
    challenges: string[];
    advice: string;
  }>;
  cellDescriptions: Record<string, string>;
  recommendations: Record<string, string[]>;
}
