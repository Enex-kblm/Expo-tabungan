import { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Plus, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react-native';

import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import { useTransactions } from '@/hooks/useTransactions';
import { calculateDaysRemaining, formatCurrency } from '@/utils/formatters';
import ProgressBar from '@/components/ProgressBar';
import TransactionItem from '@/components/TransactionItem';
import { Transaction } from '@/models/Transaction';

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getGoalById, deleteGoal } = useSavingsGoals();
  const { transactions, addTransaction, loading: transactionsLoading } = useTransactions();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const goalData = getGoalById(id);
      setGoal(goalData);
      setLoading(false);
    }
  }, [id, getGoalById, transactions]);

  const handleGoBack = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push({
      pathname: '/goals/edit',
      params: { id: goal.id }
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this savings goal? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteGoal(goal.id);
            router.back();
          }
        }
      ]
    );
  };

  const handleAddDeposit = () => {
    router.push({
      pathname: '/transactions/new',
      params: { goalId: goal.id, type: 'deposit' }
    });
  };

  const handleAddWithdrawal = () => {
    router.push({
      pathname: '/transactions/new',
      params: { goalId: goal.id, type: 'withdrawal' }
    });
  };

  const goalTransactions = transactions.filter(t => t.goalId === id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading goal details...</Text>
      </View>
    );
  }

  if (!goal) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Goal not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) : 0;
  const progressPercentage = Math.min(progress * 100, 100);
  const daysRemaining = calculateDaysRemaining(goal);
  const isOnTrack = goal.currentAmount >= (goal.dailyTarget * (Date.now() - new Date(goal.startDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButtonContainer} onPress={handleGoBack}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{goal.name}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleEdit}>
            <Edit color="#fff" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleDelete}>
            <Trash2 color="#fff" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {goal.imageUri && (
          <Image source={{ uri: goal.imageUri }} style={styles.goalImage} />
        )}

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Current</Text>
              <Text style={styles.summaryValue}>{formatCurrency(goal.currentAmount)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Target</Text>
              <Text style={styles.summaryValue}>{formatCurrency(goal.targetAmount)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Daily Target</Text>
              <Text style={styles.summaryValue}>{formatCurrency(goal.dailyTarget)}</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressLabelContainer}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressPercentage}>{progressPercentage.toFixed(1)}%</Text>
            </View>
            <ProgressBar progress={progress} isOnTrack={isOnTrack} />
            
            <View style={styles.statusContainer}>
              <View style={[styles.statusIndicator, { backgroundColor: isOnTrack ? '#2ecc71' : '#e74c3c' }]} />
              <Text style={styles.statusText}>
                {isOnTrack ? 'On track' : 'Behind schedule'}
                {daysRemaining > 0 ? ` • ${daysRemaining} days remaining` : ' • Goal reached!'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.depositButton]} 
            onPress={handleAddDeposit}
          >
            <TrendingUp size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Add Deposit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.withdrawalButton]} 
            onPress={handleAddWithdrawal}
          >
            <TrendingDown size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Add Withdrawal</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          
          {transactionsLoading ? (
            <ActivityIndicator size="small" color="#3498db" />
          ) : goalTransactions.length === 0 ? (
            <Text style={styles.emptyTransactionsText}>No transactions yet</Text>
          ) : (
            goalTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#3498db',
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  goalImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
  },
  progressContainer: {
    marginVertical: 8,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2c3e50',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
  },
  depositButton: {
    backgroundColor: '#2ecc71',
    marginRight: 8,
  },
  withdrawalButton: {
    backgroundColor: '#e74c3c',
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  transactionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#2c3e50',
  },
  emptyTransactionsText: {
    color: '#7f8c8d',
    textAlign: 'center',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f7fa',
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});