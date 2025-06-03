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
import { Plus, Filter } from 'lucide-react-native';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import GoalCard from '@/components/GoalCard';
import { SavingsGoal } from '@/models/SavingsGoal';

export default function GoalsScreen() {
  const router = useRouter();
  const { goals, loading, refreshGoals } = useSavingsGoals();
  const [refreshing, setRefreshing] = useState(false);
  const [sortOrder, setSortOrder] = useState<'progress' | 'alphabetical' | 'date'>('progress');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshGoals();
    setRefreshing(false);
  }, [refreshGoals]);

  const handleAddGoal = () => {
    router.push('/goals/new');
  };

  const handleGoalPress = (goal: SavingsGoal) => {
    router.push({
      pathname: `/goals/${goal.id}`,
      params: { id: goal.id }
    });
  };

  const toggleSortOrder = () => {
    if (sortOrder === 'progress') {
      setSortOrder('alphabetical');
    } else if (sortOrder === 'alphabetical') {
      setSortOrder('date');
    } else {
      setSortOrder('progress');
    }
  };

  const sortedGoals = [...goals].sort((a, b) => {
    if (sortOrder === 'progress') {
      const progressA = a.currentAmount / a.targetAmount;
      const progressB = b.currentAmount / b.targetAmount;
      return progressB - progressA;
    } else if (sortOrder === 'alphabetical') {
      return a.name.localeCompare(b.name);
    } else {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    }
  });

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading your savings goals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Savings Goals</Text>
        <TouchableOpacity style={styles.filterButton} onPress={toggleSortOrder}>
          <Filter size={20} color="#fff" />
          <Text style={styles.filterText}>
            {sortOrder === 'progress' ? 'By Progress' : 
             sortOrder === 'alphabetical' ? 'By Name' : 'By Date'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedGoals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GoalCard goal={item} onPress={() => handleGoalPress(item)} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No savings goals yet</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={handleAddGoal}
            >
              <Text style={styles.emptyButtonText}>Create your first goal</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddGoal}>
        <Plus color="#fff" size={24} />
      </TouchableOpacity>
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
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});