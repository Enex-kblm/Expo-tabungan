import { useState, useCallback } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { SavingsGoal } from '@/models/SavingsGoal';

export function useSavingsGoals() {
  const { 
    goals, 
    addGoal: addGoalContext, 
    updateGoal: updateGoalContext,
    deleteGoal: deleteGoalContext,
    clearAllGoals: clearAllGoalsContext
  } = useAppData();
  const [loading, setLoading] = useState(false);

  const refreshGoals = useCallback(async () => {
    setLoading(true);
    // Simulate API fetch delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
    return goals;
  }, [goals]);

  const getGoalById = useCallback((id: string) => {
    return goals.find(goal => goal.id === id);
  }, [goals]);

  return {
    goals,
    loading,
    refreshGoals,
    getGoalById,
    addGoal: addGoalContext,
    updateGoal: updateGoalContext,
    deleteGoal: deleteGoalContext,
    clearAllGoals: clearAllGoalsContext
  };
}