import React from 'react';
import { LucideIcon } from 'lucide-react';

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

export interface AppModule {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  component: React.ComponentType;
  color: string; // Tailwind class part (e.g. 'indigo')
}