import { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Filter } from 'lucide-react-native';
import { useTransactions } from '@/hooks/useTransactions';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import TransactionItem from '@/components/TransactionItem';

export default function TransactionsScreen() {
  const router = useRouter();
  const { transactions, loading, refreshTransactions } = useTransactions();
  const { goals } = useSavingsGoals();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'deposits' | 'withdrawals'>('all');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshTransactions();
    setRefreshing(false);
  }, [refreshTransactions]);

  const toggleFilter = () => {
    if (filter === 'all') {
      setFilter('deposits');
    } else if (filter === 'deposits') {
      setFilter('withdrawals');
    } else {
      setFilter('all');
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'deposits') return transaction.type === 'deposit';
    if (filter === 'withdrawals') return transaction.type === 'withdrawal';
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Function to get goal name by ID
  const getGoalName = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    return goal ? goal.name : 'Unknown Goal';
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading transactions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transaction History</Text>
        <TouchableOpacity style={styles.filterButton} onPress={toggleFilter}>
          <Filter size={20} color="#fff" />
          <Text style={styles.filterText}>
            {filter === 'all' ? 'All' : 
             filter === 'deposits' ? 'Deposits' : 'Withdrawals'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem 
            transaction={item} 
            goalName={getGoalName(item.goalId)} 
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions found</Text>
            <Text style={styles.emptySubText}>
              {filter !== 'all' 
                ? `Try changing the filter or add a ${filter === 'deposits' ? 'deposit' : 'withdrawal'}`
                : 'Transactions will appear here once you add deposits or withdrawals to your savings goals'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#3498db',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  filterText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 12,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
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
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  emptyText: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    maxWidth: '80%',
  },
});