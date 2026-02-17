export type Mode = 'softmax' | 'sigmoid';

export interface LogitItem {
  id: string;
  label: string;
  value: number;
  color: string;
}

export interface StepData {
  id: string;
  label: string;
  originalLogit: number;
  scaledLogit: number;
  exponential?: number; // Only for softmax
  probability: number;
  color: string;
}
