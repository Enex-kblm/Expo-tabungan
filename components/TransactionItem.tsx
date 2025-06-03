import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

import { Transaction } from '@/models/Transaction';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface TransactionItemProps {
  transaction: Transaction;
  goalName?: string;
}

export default function TransactionItem({ transaction, goalName }: TransactionItemProps) {
  const isDeposit = transaction.type === 'deposit';
  
  return (
    <View style={styles.container}>
      <View style={[
        styles.iconContainer, 
        { backgroundColor: isDeposit ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)' }
      ]}>
        {isDeposit ? (
          <TrendingUp size={20} color="#2ecc71" />
        ) : (
          <TrendingDown size={20} color="#e74c3c" />
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.topRow}>
          <Text style={styles.description} numberOfLines={1}>
            {transaction.description}
          </Text>
          <Text style={[
            styles.amount, 
            { color: isDeposit ? '#2ecc71' : '#e74c3c' }
          ]}>
            {isDeposit ? '+' : '-'}{formatCurrency(transaction.amount)}
          </Text>
        </View>
        
        <View style={styles.bottomRow}>
          <Text style={styles.date}>
            {formatDate(transaction.date)}
            {goalName && ` • ${goalName}`}
          </Text>
          <Text style={styles.type}>
            {isDeposit ? 'Deposit' : 'Withdrawal'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
    marginRight: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  type: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});