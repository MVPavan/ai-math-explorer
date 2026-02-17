import { LogitItem, StepData } from './types';

export const calculateSoftmaxSteps = (logits: LogitItem[], temperature: number): StepData[] => {
  // avoid division by zero
  const safeTemp = temperature === 0 ? 0.01 : temperature;

  // 1. Scale Logits
  const intermediate = logits.map(item => {
    const scaledLogit = item.value / safeTemp;
    return {
      ...item,
      originalLogit: item.value,
      scaledLogit,
    };
  });

  // 2. Exponentiate
  const step2 = intermediate.map(item => ({
    ...item,
    exponential: Math.exp(item.scaledLogit),
  }));

  // 3. Sum
  const sumExponentials = step2.reduce((acc, curr) => acc + curr.exponential, 0);

  // 4. Normalize
  return step2.map(item => ({
    ...item,
    probability: item.exponential / sumExponentials,
  }));
};

export const calculateSigmoidSteps = (logits: LogitItem[], temperature: number): StepData[] => {
  const safeTemp = temperature === 0 ? 0.01 : temperature;

  return logits.map(item => {
    const scaledLogit = item.value / safeTemp;
    // Sigmoid Formula: 1 / (1 + e^-x)
    const probability = 1 / (1 + Math.exp(-scaledLogit));

    return {
      ...item,
      originalLogit: item.value,
      scaledLogit,
      probability,
    };
  });
};

export const formatNumber = (num: number, decimals = 3): string => {
  if (Math.abs(num) < 0.001 && num !== 0) {
    return num.toExponential(2);
  }
  return num.toFixed(decimals);
};
