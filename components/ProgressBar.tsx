import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface ProgressBarProps {
  progress: number;
  isOnTrack: boolean;
  height?: number;
}

export default function ProgressBar({ 
  progress, 
  isOnTrack, 
  height = 8 
}: ProgressBarProps) {
  // Ensure progress is between 0 and 1
  const normalizedProgress = Math.min(Math.max(progress, 0), 1);
  
  return (
    <View style={[styles.container, { height }]}>
      <View 
        style={[
          styles.progressBar, 
          { 
            width: `${normalizedProgress * 100}%`,
            backgroundColor: isOnTrack ? '#2ecc71' : '#e74c3c' 
          }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
});