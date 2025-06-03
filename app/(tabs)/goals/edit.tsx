import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Image as ImageIcon, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import { formatCurrency } from '@/utils/formatters';

export default function EditGoalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getGoalById, updateGoal } = useSavingsGoals();
  
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [dailyTarget, setDailyTarget] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    targetAmount: '',
    dailyTarget: '',
  });

  useEffect(() => {
    if (id) {
      const goal = getGoalById(id);
      if (goal) {
        setName(goal.name);
        setTargetAmount(goal.targetAmount.toString());
        setDailyTarget(goal.dailyTarget.toString());
        setImageUri(goal.imageUri || '');
      }
      setLoading(false);
    }
  }, [id, getGoalById]);

  const handleGoBack = () => {
    router.back();
  };

  const validateInputs = () => {
    const newErrors = {
      name: '',
      targetAmount: '',
      dailyTarget: '',
    };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Goal name is required';
      isValid = false;
    }

    const targetNum = parseFloat(targetAmount);
    if (isNaN(targetNum) || targetNum <= 0) {
      newErrors.targetAmount = 'Target amount must be a positive number';
      isValid = false;
    }

    const dailyNum = parseFloat(dailyTarget);
    if (isNaN(dailyNum) || dailyNum <= 0) {
      newErrors.dailyTarget = 'Daily target must be a positive number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdateGoal = () => {
    if (!validateInputs()) return;

    const daysToComplete = parseFloat(targetAmount) / parseFloat(dailyTarget);
    const goal = getGoalById(id);
    
    if (!goal) return;
    
    const updatedGoal = {
      ...goal,
      name,
      targetAmount: parseFloat(targetAmount),
      dailyTarget: parseFloat(dailyTarget),
      estimatedCompletionDays: Math.ceil(daysToComplete),
      imageUri: imageUri || null,
    };

    updateGoal(updatedGoal);
    router.back();
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required', 
        'You need to allow access to your photos to add an image'
      );
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImageUri('');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading goal data...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Goal</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Goal Name</Text>
          <TextInput
            style={[styles.input, errors.name ? styles.inputError : null]}
            placeholder="What are you saving for?"
            value={name}
            onChangeText={setName}
            maxLength={50}
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Target Amount</Text>
          <TextInput
            style={[styles.input, errors.targetAmount ? styles.inputError : null]}
            placeholder="0.00"
            value={targetAmount}
            onChangeText={setTargetAmount}
            keyboardType="numeric"
          />
          {errors.targetAmount ? (
            <Text style={styles.errorText}>{errors.targetAmount}</Text>
          ) : null}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Daily Savings Target</Text>
          <TextInput
            style={[styles.input, errors.dailyTarget ? styles.inputError : null]}
            placeholder="0.00"
            value={dailyTarget}
            onChangeText={setDailyTarget}
            keyboardType="numeric"
          />
          {errors.dailyTarget ? (
            <Text style={styles.errorText}>{errors.dailyTarget}</Text>
          ) : null}
        </View>

        {targetAmount && dailyTarget && !isNaN(parseFloat(targetAmount)) && !isNaN(parseFloat(dailyTarget)) && (
          <View style={styles.calculationCard}>
            <Text style={styles.calculationText}>
              Saving {formatCurrency(parseFloat(dailyTarget))} daily will reach your goal of{' '}
              {formatCurrency(parseFloat(targetAmount))} in approximately{' '}
              <Text style={styles.calculationHighlight}>
                {Math.ceil(parseFloat(targetAmount) / parseFloat(dailyTarget))} days
              </Text>
            </Text>
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Goal Image (Optional)</Text>
          
          {imageUri ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                <X size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <ImageIcon size={24} color="#3498db" />
              <Text style={styles.imagePickerText}>Add an image</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleUpdateGoal}>
          <Text style={styles.submitButtonText}>Update Savings Goal</Text>
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
    backgroundColor: '#3498db',
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
  calculationCard: {
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  calculationText: {
    fontSize: 15,
    color: '#2c3e50',
    lineHeight: 22,
  },
  calculationHighlight: {
    fontWeight: '700',
    color: '#3498db',
  },
  imagePickerButton: {
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderStyle: 'dashed',
  },
  imagePickerText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#3498db',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(231, 76, 60, 0.8)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#3498db',
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
});