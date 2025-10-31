// lib/constants/gradient.ts

export const GRADIENTS = {
  button: ['#4F46E5', '#7C3AED'] as const, // ← as const
  buttonLoading: ['#6366F1', '#8B5CF6'] as const,
} satisfies Record<string, readonly [string, string, ...string[]]>;
