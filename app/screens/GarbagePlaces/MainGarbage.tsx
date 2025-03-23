import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AdminNav from '../../Components/AdminNav';
import Header from '../../Components/HeaderAdmin';
import { FIREBASE_DB } from '../../../Firebase_Config';
import { collection, onSnapshot } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MainGarbage = () => {
  const navigation = useNavigation();
  const [garbagePlaces, setGarbagePlaces] = useState<Array<{
    id: string;
    locationName: string;
    address: string;
    capacity: string;
    contactPerson: string;
    phoneNumber: string;
    wasteType: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(FIREBASE_DB, 'GarbagePlaces'),
      (snapshot) => {
        const places = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as {
            locationName: string;
            address: string;
            capacity: string;
            contactPerson: string;
            phoneNumber: string;
            wasteType: string;
          }
        }));
        setGarbagePlaces(places);
        setLoading(false);
      },
      (error) => {
        setError('Failed to load waste management data');
        setLoading(false);
        console.error('Firestore error:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleGenerateReport = () => {
    if (garbagePlaces.length === 0) {
      Alert.alert('No Data', 'Add garbage bins to generate reports');
      return;
    }
    navigation.navigate('ReportDetails', { garbagePlaces });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading Waste Management System...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={40} color="#EF4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setLoading(true)}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Waste Management Dashboard</Text>
        
        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="delete" size={28} color="#059669" />
            <Text style={styles.statNumber}>{garbagePlaces.length}</Text>
            <Text style={styles.statLabel}>Total Bins</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="storage" size={28} color="#059669" />
            <Text style={styles.statNumber}>
              {garbagePlaces.reduce((sum, place) => sum + Number(place.capacity), 0)}kg
            </Text>
            <Text style={styles.statLabel}>Total Capacity</Text>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.gridContainer}>
          <TouchableOpacity 
            style={[styles.actionCard, styles.addCard]}
            onPress={() => navigation.navigate('AddGarbagePlace')}
          >
            <Icon name="add-circle" size={48} color="#FFF" />
            <Text style={styles.actionText}>Add New Bin</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('HomeG')}
          >
            <Icon name="search" size={48} color="#10B981" />
            <Text style={styles.actionText}>Manage Bins</Text>
            <Text style={styles.actionSubtext}>{garbagePlaces.length} locations</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, garbagePlaces.length === 0 && styles.disabledCard]}
            onPress={handleGenerateReport}
            disabled={garbagePlaces.length === 0}
          >
            <Icon 
              name="assignment" 
              size={48} 
              color={garbagePlaces.length === 0 ? "#94A3B8" : "#10B981"} 
            />
            <Text style={[
              styles.actionText,
              garbagePlaces.length === 0 && styles.disabledText
            ]}>
              Generate Report
            </Text>
            {garbagePlaces.length === 0 && (
              <Text style={styles.disabledHint}>Add bins to enable</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <AdminNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 24,
    paddingBottom: 80,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 32,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  gridContainer: {
    gap: 20,
  },
  actionCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  addCard: {
    backgroundColor: '#10B981',
    shadowColor: '#059669',
  },
  actionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 16,
    textAlign: 'center',
  },
  actionSubtext: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
  },
  disabledCard: {
    opacity: 0.7,
    backgroundColor: '#F1F5F9',
  },
  disabledText: {
    color: '#94A3B8',
  },
  disabledHint: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default MainGarbage;