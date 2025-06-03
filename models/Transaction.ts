export type TransactionType = 'deposit' | 'withdrawal';

export interface Transaction {
  id: string;
  goalId: string;
  amount: number;
  description: string;
  date: string;
  type: TransactionType;
}