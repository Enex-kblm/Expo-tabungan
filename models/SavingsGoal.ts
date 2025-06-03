export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  dailyTarget: number;
  startDate: string;
  estimatedCompletionDays: number;
  imageUri: string | null;
}