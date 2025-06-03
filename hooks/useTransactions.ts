import { useState, useCallback } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { Transaction } from '@/models/Transaction';

export function useTransactions() {
  const { 
    transactions, 
    addTransaction: addTransactionContext,
    clearAllTransactions: clearAllTransactionsContext 
  } = useAppData();
  const [loading, setLoading] = useState(false);

  const refreshTransactions = useCallback(async () => {
    setLoading(true);
    // Simulate API fetch delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
    return transactions;
  }, [transactions]);

  const getTransactionsByGoalId = useCallback((goalId: string) => {
    return transactions.filter(transaction => transaction.goalId === goalId);
  }, [transactions]);

  return {
    transactions,
    loading,
    refreshTransactions,
    getTransactionsByGoalId,
    addTransaction: addTransactionContext,
    clearAllTransactions: clearAllTransactionsContext
  };
}