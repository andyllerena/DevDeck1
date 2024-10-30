import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Target,
  Trophy,
  Clock,
  CheckCircle2,
  Plus,
  Minus,
  Flame,
} from 'lucide-react';
import type { Goal, GoalCardProps, AddGoalDialogProps } from '../types';

// Utility functions for goal management
const getLocalStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  }
  return defaultValue;
};

const setLocalStorage = <T,>(key: string, value: T): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const isNewDay = (lastUpdated: string): boolean => {
  if (!lastUpdated) return true;
  const last = new Date(lastUpdated);
  const now = new Date();
  return (
    last.getDate() !== now.getDate() ||
    last.getMonth() !== now.getMonth() ||
    last.getFullYear() !== now.getFullYear()
  );
};

const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onUpdateProgress,
  onDelete,
}) => {
  const getProgressText = () => {
    if (goal.type === 'daily') {
      return `${goal.current}/${goal.target} problems today`;
    }
    return `${goal.current}/${goal.target} ${goal.category} problems`;
  };

  const getIcon = () => {
    switch (goal.type) {
      case 'daily':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'category':
        return <Target className="h-5 w-5 text-purple-500" />;
      default:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
    }
  };

  const progress = (goal.current / goal.target) * 100;

  return (
    <div className="group relative">
      <div
        className={`absolute inset-0 rounded-lg bg-gradient-to-r 
        ${
          goal.type === 'daily'
            ? 'from-blue-500/20 to-blue-500/5'
            : 'from-purple-500/20 to-purple-500/5'
        } 
        opacity-0 group-hover:opacity-100 transition-opacity`}
      />

      <Card className="relative overflow-hidden border-none bg-white/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getIcon()}
              <div>
                <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                <p className="text-sm text-gray-600">{getProgressText()}</p>
                {goal.type === 'daily' && goal.streak > 0 && (
                  <div className="mt-1 flex items-center gap-1 text-sm text-orange-500">
                    <Flame className="h-4 w-4" />
                    <span>{goal.streak} day streak!</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdateProgress(goal.id, -1)}
                disabled={goal.current <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdateProgress(goal.id, 1)}
                disabled={goal.current >= goal.target}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out
                ${goal.type === 'daily' ? 'bg-blue-500' : 'bg-purple-500'}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <div className="mt-2 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-red-500"
              onClick={() => onDelete(goal.id)}
            >
              Remove
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AddGoalDialog: React.FC<AddGoalDialogProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [goalType, setGoalType] = useState('daily');
  const [target, setTarget] = useState(3);
  const [category, setCategory] = useState('Array');

  const categories = [
    { id: 'array', name: 'Array', icon: '📊' },
    { id: 'string', name: 'String', icon: '📝' },
    { id: 'linked-list', name: 'Linked List', icon: '🔗' },
    { id: 'tree', name: 'Tree', icon: '🌳' },
    { id: 'dp', name: 'Dynamic Programming', icon: '🧮' },
    { id: 'graph', name: 'Graph', icon: '🕸️' },
  ];

  const handleAddGoal = () => {
    const newGoal = {
      id: Date.now(),
      type: goalType,
      current: 0,
      target,
      category,
      streak: 0,
      lastUpdated: new Date().toISOString(),
      title:
        goalType === 'daily'
          ? `Solve ${target} problems daily`
          : `Complete ${target} ${category} problems`,
    };
    onAdd(newGoal);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-[450px] animate-in fade-in-0 zoom-in-95">
        <Card className="border-2 border-gray-800 bg-gray-900 shadow-2xl">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6">
            <h2 className="text-2xl font-bold text-white">Create New Goal</h2>
            <p className="mt-2 text-sm text-white/80">
              Set a target to track your progress
            </p>
          </div>

          <CardContent className="space-y-6 bg-gray-900 p-6">
            {/* Goal Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">
                Choose Goal Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setGoalType('daily')}
                  className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all
                    ${
                      goalType === 'daily'
                        ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                        : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-blue-500/50 hover:bg-blue-500/10'
                    }`}
                >
                  <Clock
                    className={`h-8 w-8 ${
                      goalType === 'daily' ? 'text-blue-400' : 'text-gray-400'
                    }`}
                  />
                  <span className="mt-2 font-medium">Daily Target</span>
                  <span className="mt-1 text-xs text-gray-400">
                    Reset every day
                  </span>
                </button>

                <button
                  onClick={() => setGoalType('category')}
                  className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all
                    ${
                      goalType === 'category'
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                        : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-purple-500/50 hover:bg-purple-500/10'
                    }`}
                >
                  <Target
                    className={`h-8 w-8 ${
                      goalType === 'category'
                        ? 'text-purple-400'
                        : 'text-gray-400'
                    }`}
                  />
                  <span className="mt-2 font-medium">Category Goal</span>
                  <span className="mt-1 text-xs text-gray-400">
                    Focus on one topic
                  </span>
                </button>
              </div>
            </div>

            {/* Target Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">
                Daily Target
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    onClick={() => setTarget(num)}
                    className={`flex h-12 items-center justify-center rounded-lg border-2 font-medium transition-all
                      ${
                        target === num
                          ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                          : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-blue-500/50 hover:bg-blue-500/10'
                      }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            {goalType === 'category' && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">
                  Select Category
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.name)}
                      className={`flex items-center gap-3 rounded-lg border-2 p-3 transition-all
                        ${
                          category === cat.name
                            ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                            : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-purple-500/50 hover:bg-purple-500/10'
                        }`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span className="font-medium">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-2 border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddGoal}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
              >
                Create Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const GoalsSection: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const savedGoals = getLocalStorage<Goal[]>('blind75-goals', []);
    setGoals(savedGoals);
  }, []);

  useEffect(() => {
    const updatedGoals = goals.map(goal => {
      if (goal.type === 'daily' && isNewDay(goal.lastUpdated)) {
        return {
          ...goal,
          current: 0,
          lastUpdated: new Date().toISOString(),
          streak: goal.current >= goal.target ? goal.streak + 1 : 0,
        };
      }
      return goal;
    });

    if (JSON.stringify(updatedGoals) !== JSON.stringify(goals)) {
      setGoals(updatedGoals);
      setLocalStorage('blind75-goals', updatedGoals);
    }
  }, [goals]);

  const handleAddGoal = (newGoal: Goal) => {
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    setLocalStorage('blind75-goals', updatedGoals);
  };

  const handleUpdateProgress = (goalId: string, change: number) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const newCurrent = Math.max(
          0,
          Math.min(goal.target, goal.current + change),
        );
        return {
          ...goal,
          current: newCurrent,
          lastUpdated: new Date().toISOString(),
          streak:
            goal.type === 'daily' && newCurrent >= goal.target
              ? goal.streak + 1
              : goal.streak,
        };
      }
      return goal;
    });
    setGoals(updatedGoals);
    setLocalStorage('blind75-goals', updatedGoals);
  };

  const handleDeleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(updatedGoals);
    setLocalStorage('blind75-goals', updatedGoals);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">My Goals</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900"
          onClick={() => setIsDialogOpen(true)}
        >
          <Target className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
      </div>

      <div className="space-y-3">
        {goals.map(goal => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onUpdateProgress={handleUpdateProgress}
            onDelete={handleDeleteGoal}
          />
        ))}
      </div>

      <AddGoalDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAdd={handleAddGoal}
      />
    </div>
  );
};

export default GoalsSection;
