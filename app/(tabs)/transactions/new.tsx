import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

import { useTransactions } from '@/hooks/useTransactions';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import { formatCurrency } from '@/utils/formatters';

export default function NewTransactionScreen() {
  const { goalId, type = 'deposit' } = useLocalSearchParams<{ goalId: string, type: 'deposit' | 'withdrawal' }>();
  const router = useRouter();
  const { addTransaction } = useTransactions();
  const { getGoalById, updateGoal } = useSavingsGoals();
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({
    amount: '',
    description: '',
  });
  const [goal, setGoal] = useState(null);

  useEffect(() => {
    if (goalId) {
      const goalData = getGoalById(goalId);
      setGoal(goalData);
    }
  }, [goalId, getGoalById]);

  const handleGoBack = () => {
    router.back();
  };

  const validateInputs = () => {
    const newErrors = {
      amount: '',
      description: '',
    };
    let isValid = true;

    if (!description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = 'Amount must be a positive number';
      isValid = false;
    }

    if (type === 'withdrawal' && goal && amountNum > goal.currentAmount) {
      newErrors.amount = `Cannot withdraw more than ${formatCurrency(goal.currentAmount)}`;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddTransaction = () => {
    if (!validateInputs() || !goal) return;

    const amountNum = parseFloat(amount);
    
    const newTransaction = {
      id: Date.now().toString(),
      goalId,
      amount: amountNum,
      description,
      date: new Date().toISOString(),
      type,
    };

    // Update goal amount
    const updatedAmount = type === 'deposit' 
      ? goal.currentAmount + amountNum 
      : goal.currentAmount - amountNum;
    
    const updatedGoal = {
      ...goal,
      currentAmount: updatedAmount,
    };

    addTransaction(newTransaction);
    updateGoal(updatedGoal);
    router.back();
  };

  const isDeposit = type === 'deposit';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <View style={[
        styles.header, 
        { backgroundColor: isDeposit ? '#2ecc71' : '#e74c3c' }
      ]}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isDeposit ? 'Add Deposit' : 'Add Withdrawal'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {goal && (
          <View style={styles.goalInfoCard}>
            <Text style={styles.goalInfoLabel}>Goal</Text>
            <Text style={styles.goalInfoName}>{goal.name}</Text>
            <Text style={styles.goalInfoBalance}>
              Current Balance: {formatCurrency(goal.currentAmount)}
            </Text>
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={[styles.input, errors.amount ? styles.inputError : null]}
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          {errors.amount ? (
            <Text style={styles.errorText}>{errors.amount}</Text>
          ) : null}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, errors.description ? styles.inputError : null]}
            placeholder={`What is this ${isDeposit ? 'deposit' : 'withdrawal'} for?`}
            value={description}
            onChangeText={setDescription}
            maxLength={100}
          />
          {errors.description ? (
            <Text style={styles.errorText}>{errors.description}</Text>
          ) : null}
        </View>

        <TouchableOpacity 
          style={[
            styles.submitButton, 
            { backgroundColor: isDeposit ? '#2ecc71' : '#e74c3c' }
          ]} 
          onPress={handleAddTransaction}
        >
          <Text style={styles.submitButtonText}>
            {isDeposit ? 'Add Deposit' : 'Add Withdrawal'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  goalInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  goalInfoLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  goalInfoName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
  },
  goalInfoBalance: {
    fontSize: 16,
    color: '#2c3e50',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});