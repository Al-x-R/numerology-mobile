// contexts/SavedCalculationsContext.tsx
// Saved Pythagoras matrices and compatibility checks. Only the input dates are stored:
// results are pure functions of the dates and are recalculated when an entry is opened.
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useProfile } from '@/contexts/ProfileContext';

const STORAGE_KEY = '@saved_calculations';

export type CalculationKind = 'matrix' | 'compatibility';

// Per kind: free users can keep one matrix and one compatibility check
export const SAVED_LIMITS = { free: 1, pro: 10 };

// Dates are in the DD.MM.YYYY format used by the input forms
export type CalculationInput =
  | { kind: 'matrix'; date: string }
  | { kind: 'compatibility'; date1: string; date2: string };

export type SavedCalculation = CalculationInput & {
  id: string;
  label: string;
  createdAt: number;
};

interface SavedCalculationsContextType {
  items: SavedCalculation[];
  limit: number;
  canSave: (kind: CalculationKind) => boolean;
  findSaved: (input: CalculationInput) => SavedCalculation | undefined;
  save: (input: CalculationInput, label: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clear: () => Promise<void>;
}

const SavedCalculationsContext = createContext<SavedCalculationsContextType | undefined>(undefined);

const isSameInput = (a: CalculationInput, b: CalculationInput): boolean => {
  if (a.kind === 'matrix' && b.kind === 'matrix') return a.date === b.date;
  if (a.kind === 'compatibility' && b.kind === 'compatibility') {
    return a.date1 === b.date1 && a.date2 === b.date2;
  }
  return false;
};

export const SavedCalculationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isPremium } = useProfile();
  const [items, setItems] = useState<SavedCalculation[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(json => setItems(json ? JSON.parse(json) : []))
      .catch(e => console.error('Error loading saved calculations:', e));
  }, []);

  const persist = async (next: SavedCalculation[]) => {
    setItems(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const limit = isPremium ? SAVED_LIMITS.pro : SAVED_LIMITS.free;

  // Entries over the limit (e.g. after PRO expires) stay readable, only new saves are blocked
  const canSave = useCallback(
    (kind: CalculationKind) => items.filter(item => item.kind === kind).length < limit,
    [items, limit],
  );

  const findSaved = useCallback(
    (input: CalculationInput) => items.find(item => isSameInput(item, input)),
    [items],
  );

  const save = async (input: CalculationInput, label: string) => {
    const entry: SavedCalculation = { ...input, id: Date.now().toString(), label, createdAt: Date.now() };
    await persist([entry, ...items]);
  };

  const remove = async (id: string) => {
    await persist(items.filter(item => item.id !== id));
  };

  const clear = async () => {
    setItems([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <SavedCalculationsContext.Provider value={{ items, limit, canSave, findSaved, save, remove, clear }}>
      {children}
    </SavedCalculationsContext.Provider>
  );
};

export const useSavedCalculations = () => {
  const context = useContext(SavedCalculationsContext);
  if (!context) throw new Error('useSavedCalculations must be used within SavedCalculationsProvider');
  return context;
};
