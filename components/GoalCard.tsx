import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SavingsGoal } from '@/models/SavingsGoal';
import ProgressBar from './ProgressBar';
import { formatCurrency, calculateDaysRemaining } from '@/utils/formatters';

interface GoalCardProps {
  goal: SavingsGoal;
  onPress: () => void;
}

export default function GoalCard({ goal, onPress }: GoalCardProps) {
  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) : 0;
  const progressPercentage = Math.min(progress * 100, 100);
  const daysRemaining = calculateDaysRemaining(goal);
  
  // Check if on track by comparing current amount with expected amount based on daily target
  const daysElapsed = (Date.now() - new Date(goal.startDate).getTime()) / (1000 * 60 * 60 * 24);
  const expectedAmount = goal.dailyTarget * daysElapsed;
  const isOnTrack = goal.currentAmount >= expectedAmount;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.contentContainer}>
        {goal.imageUri ? (
          <Image source={{ uri: goal.imageUri }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {goal.name}
            </Text>
            
            <View style={[
              styles.statusIndicator, 
              { backgroundColor: isOnTrack ? '#2ecc71' : '#e74c3c' }
            ]} />
          </View>
          
          <View style={styles.progressContainer}>
            <ProgressBar progress={progress} isOnTrack={isOnTrack} />
            <View style={styles.progressLabels}>
              <Text style={styles.amountText}>{formatCurrency(goal.currentAmount)}</Text>
              <Text style={styles.progressText}>{progressPercentage.toFixed(1)}%</Text>
              <Text style={styles.targetText}>{formatCurrency(goal.targetAmount)}</Text>
            </View>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.daysText}>
              {daysRemaining > 0 
                ? `${daysRemaining} days remaining`
                : 'Goal reached!'}
            </Text>
            <Text style={[styles.statusText, { color: isOnTrack ? '#2ecc71' : '#e74c3c' }]}>
              {isOnTrack ? 'On track' : 'Behind'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contentContainer: {
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: '100%',
  },
  imagePlaceholder: {
    width: 100,
    height: '100%',
    backgroundColor: '#ecf0f1',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    flex: 1,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  amountText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3498db',
  },
  targetText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  daysText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
});