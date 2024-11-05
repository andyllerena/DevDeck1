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
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({
  children,
  categories,
}) => {
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(
    new Set(),
  );
  const totalProblems = categories.reduce(
    (acc, category) => acc + category.problems.length,
    0,
  );

  useEffect(() => {
    const savedProblems = localStorage.getItem('completedProblems');
    if (savedProblems) {
      try {
        setCompletedProblems(new Set(JSON.parse(savedProblems)));
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
  }, []);

  const updateProgress = (problemId: string, completed: boolean) => {
    setCompletedProblems(prev => {
      const newSet = new Set(prev);
      if (completed) {
        newSet.add(problemId);
      } else {
        newSet.delete(problemId);
      }
      localStorage.setItem(
        'completedProblems',
        JSON.stringify(Array.from(newSet)),
      );
      return newSet;
    });
  };

  const resetProgress = () => {
    setCompletedProblems(new Set());
    localStorage.removeItem('completedProblems');
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
