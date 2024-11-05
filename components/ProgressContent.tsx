'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Category } from '@/types';
interface ProgressContextType {
  completedProblems: Set<string>;
  totalProblems: number;
  updateProgress: (problemId: string, completed: boolean) => void;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType>({
  completedProblems: new Set<string>(),
  totalProblems: 0,
  updateProgress: () => {},
  resetProgress: () => {},
});

export const useProgress = () => useContext(ProgressContext);

interface ProgressProviderProps {
  children: React.ReactNode;
  categories: Category[];
  userId?: string;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({
  children,
  categories,
  userId,
}) => {
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(
    new Set(),
  );
  const totalProblems = categories.reduce(
    (acc, category) => acc + category.problems.length,
    0,
  );
  const storageKey = userId
    ? `completedProblems_${userId}`
    : 'completedProblems_anonymous';
  useEffect(() => {
    if (storageKey) {
      const savedProblems = localStorage.getItem(storageKey);
      if (savedProblems) {
        try {
          setCompletedProblems(new Set(JSON.parse(savedProblems)));
        } catch (error) {
          console.error('Error loading progress:', error);
        }
      }
    } else {
      // Clear progress if no user is logged in
      setCompletedProblems(new Set());
    }
  }, [storageKey]); // React to userId changes

  const updateProgress = (problemId: string, completed: boolean) => {
    setCompletedProblems(prev => {
      const newSet = new Set(prev);
      if (completed) {
        newSet.add(problemId);
      } else {
        newSet.delete(problemId);
      }
      localStorage.setItem(storageKey, JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };
  const resetProgress = () => {
    setCompletedProblems(new Set());
    localStorage.removeItem(storageKey);
  };

  return (
    <ProgressContext.Provider
      value={{
        completedProblems,
        totalProblems,
        updateProgress,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};
