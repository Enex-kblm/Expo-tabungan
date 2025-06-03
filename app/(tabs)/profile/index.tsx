import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Switch,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Bell, 
  Moon, 
  Lock, 
  HelpCircle, 
  User, 
  Database, 
  LogOut,
  ChevronRight
} from 'lucide-react-native';

import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import { useTransactions } from '@/hooks/useTransactions';

export default function ProfileScreen() {
  const router = useRouter();
  const { clearAllGoals } = useSavingsGoals();
  const { clearAllTransactions } = useTransactions();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all your goals and transactions? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Data', 
          style: 'destructive',
          onPress: () => {
            clearAllGoals();
            clearAllTransactions();
            Alert.alert('Data Cleared', 'All your savings goals and transactions have been deleted.');
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This feature will be available in the next update.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder}>
            <User size={32} color="#fff" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Guest User</Text>
            <Text style={styles.profileEmail}>Sign in to sync your data</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Bell size={20} color="#3498db" />
            </View>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#d0d3d4', true: '#3498db' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Moon size={20} color="#3498db" />
            </View>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#d0d3d4', true: '#3498db' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
            <View style={styles.settingIcon}>
              <Database size={20} color="#3498db" />
            </View>
            <Text style={styles.settingLabel}>Export Data</Text>
            <ChevronRight size={20} color="#95a5a6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleClearData}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(231, 76, 60, 0.1)' }]}>
              <Database size={20} color="#e74c3c" />
            </View>
            <Text style={[styles.settingLabel, { color: '#e74c3c' }]}>Clear All Data</Text>
            <ChevronRight size={20} color="#95a5a6" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <HelpCircle size={20} color="#3498db" />
            </View>
            <Text style={styles.settingLabel}>Help & Support</Text>
            <ChevronRight size={20} color="#95a5a6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Lock size={20} color="#3498db" />
            </View>
            <Text style={styles.settingLabel}>Privacy Policy</Text>
            <ChevronRight size={20} color="#95a5a6" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutButton}>
          <LogOut size={20} color="#e74c3c" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Savings Tracker v1.0.0</Text>
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
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#3498db',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    color: '#95a5a6',
    marginBottom: 24,
  },
});