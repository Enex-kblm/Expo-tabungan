import { useCallback, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl, 
  ActivityIndicator, 
  Image 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import GoalCard from '@/components/GoalCard';
import { SavingsGoal } from '@/models/SavingsGoal';

export default function HomeScreen() {
  const router = useRouter();
  const { goals, loading, refreshGoals } = useSavingsGoals();
  const [refreshing, setRefreshing] = useState(false);

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
        <Text style={styles.title}>Savings Tracker</Text>
      </View>

      {goals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/4386158/pexels-photo-4386158.jpeg' }} 
            style={styles.emptyImage} 
          />
          <Text style={styles.emptyTitle}>No savings goals yet</Text>
          <Text style={styles.emptySubtitle}>
            Start tracking your savings by creating your first goal
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={handleAddGoal}
          >
            <Text style={styles.emptyButtonText}>Create Goal</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={goals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GoalCard goal={item} onPress={() => handleGoalPress(item)} />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

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
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});