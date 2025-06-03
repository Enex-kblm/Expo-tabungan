import { SavingsGoal } from '@/models/SavingsGoal';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function calculateDaysRemaining(goal: SavingsGoal): number {
  if (goal.currentAmount >= goal.targetAmount) {
    return 0;
  }
  
  const remainingAmount = goal.targetAmount - goal.currentAmount;
  return Math.ceil(remainingAmount / goal.dailyTarget);
}