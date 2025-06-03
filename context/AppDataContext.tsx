import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SavingsGoal } from '@/models/SavingsGoal';
import { Transaction } from '@/models/Transaction';

interface AppDataContextType {
  goals: SavingsGoal[];
  transactions: Transaction[];
  addGoal: (goal: SavingsGoal) => void;
  updateGoal: (goal: SavingsGoal) => void;
  deleteGoal: (id: string) => void;
  addTransaction: (transaction: Transaction) => void;
  clearAllGoals: () => void;
  clearAllTransactions: () => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load data from storage on app start
  useEffect(() => {
    const loadData = async () => {
      try {
        const goalsData = await AsyncStorage.getItem('savings_goals');
        const transactionsData = await AsyncStorage.getItem('transactions');
        
        if (goalsData) {
          setGoals(JSON.parse(goalsData));
        }
        
        if (transactionsData) {
          setTransactions(JSON.parse(transactionsData));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save goals to storage when they change
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem('savings_goals', JSON.stringify(goals))
        .catch(error => console.error('Error saving goals:', error));
    }
  }, [goals, loading]);

  // Save transactions to storage when they change
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem('transactions', JSON.stringify(transactions))
        .catch(error => console.error('Error saving transactions:', error));
    }
  }, [transactions, loading]);

  const addGoal = (goal: SavingsGoal) => {
    setGoals(prevGoals => [...prevGoals, goal]);
  };

  const updateGoal = (updatedGoal: SavingsGoal) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === updatedGoal.id ? updatedGoal : goal
      )
    );
  };

  const deleteGoal = (id: string) => {
    setGoals(prevGoals => prevGoals.filter(goal => goal.id !== id));
    setTransactions(prevTransactions => 
      prevTransactions.filter(transaction => transaction.goalId !== id)
    );
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prevTransactions => [...prevTransactions, transaction]);
  };

  const clearAllGoals = () => {
    setGoals([]);
    AsyncStorage.removeItem('savings_goals')
      .catch(error => console.error('Error clearing goals:', error));
  };

  const clearAllTransactions = () => {
    setTransactions([]);
    AsyncStorage.removeItem('transactions')
      .catch(error => console.error('Error clearing transactions:', error));
  };

  return (
    <AppDataContext.Provider
      value={{
        goals,
        transactions,
        addGoal,
        updateGoal,
        deleteGoal,
        addTransaction,
        clearAllGoals,
        clearAllTransactions,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}