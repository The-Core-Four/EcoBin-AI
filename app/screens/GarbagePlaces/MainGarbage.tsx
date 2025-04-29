import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AdminNav from '../../Components/AdminNav';
import Header from '../../Components/HeaderAdmin';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../Firebase_Config';
import { collection, onSnapshot } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Alert } from 'react-native';

interface GarbagePlace {
  id: string;
  locationName: string;
  address: string;
  capacity: string;
  contactPerson: string;
  phoneNumber: string;
  wasteType: string;
}

const MainGarbage = () => {
  const navigation = useNavigation<any>();
  const [garbagePlaces, setGarbagePlaces] = useState<GarbagePlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) {
        setError('Authentication required. Please login.');
        return;
      }

      const q = collection(FIREBASE_DB, 'GarbagePlaces');
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const places = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<GarbagePlace, 'id'>
          }));
          setGarbagePlaces(places);
          setLastUpdated(new Date().toLocaleTimeString());
        },
        (error) => {
          setError('Failed to load data. Please check your connection.');
          console.error('Firestore error:', error);
        }
      );

      setLoading(false);
      setRefreshing(false);
      return unsubscribe;
    } catch (err) {
      setError('Failed to initialize data');
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const handleGenerateReport = useCallback(() => {
    if (garbagePlaces.length === 0) {
      Alert.alert(
        'No Data', 
        'Add garbage bins to generate reports',
        [{ text: 'OK', onPress: () => navigation.navigate('AddGarbagePlace') }]
      );
      return;
    }
    navigation.navigate('ReportDetails', {
      garbagePlaces,
      stats: {
        totalBins: garbagePlaces.length,
        totalCapacity: garbagePlaces.reduce((sum, place) => sum + Number(place.capacity), 0)
      }
    });
  }, [garbagePlaces, navigation]);

  const StatCard = ({ icon, value, label }: { icon: string; value: string | number; label: string }) => (
    <View style={styles.statCard}>
      <Icon name={icon} size={28} color="#059669" />
      <Text style={styles.statNumber}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const ActionCard = ({ 
    icon, 
    text, 
    subtext, 
    onPress, 
    disabled = false 
  }: { 
    icon: string; 
    text: string; 
    subtext?: string; 
    onPress: () => void; 
    disabled?: boolean; 
  }) => (
    <TouchableOpacity
      style={[styles.actionCard, disabled && styles.disabledCard]}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={disabled}
    >
      <Icon 
        name={icon} 
        size={48} 
        color={disabled ? "#94A3B8" : "#10B981"} 
      />
      <Text style={[styles.actionText, disabled && styles.disabledText]}>
        {text}
      </Text>
      {subtext && <Text style={styles.actionSubtext}>{subtext}</Text>}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Initializing Waste Management System...</Text>
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
          onPress={fetchData}
        >
          <Text style={styles.retryText}>⟳ Refresh Data</Text>
        </TouchableOpacity>
        <Text style={styles.lastUpdated}>Last attempt: {lastUpdated}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#10B981"
            colors={['#10B981']}
          />
        }
      >
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Waste Management Dashboard</Text>
          <Text style={styles.lastUpdated}>Updated: {lastUpdated}</Text>
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            icon="delete"
            value={garbagePlaces.length}
            label="Active Bins"
          />
          <StatCard
            icon="storage"
            value={`${garbagePlaces.reduce((sum, place) => sum + Number(place.capacity), 0)}kg`}
            label="Total Capacity"
          />
        </View>

        <View style={styles.gridContainer}>
          <ActionCard
            icon="add-circle"
            text="Add New Bin"
            onPress={() => navigation.navigate('AddGarbagePlace')}
          />

          <ActionCard
            icon="search"
            text="Manage Bins"
            subtext={`${garbagePlaces.length} locations registered`}
            onPress={() => navigation.navigate('HomeG')}
          />

          <ActionCard
            icon="assignment"
            text="Generate Report"
            subtext={garbagePlaces.length === 0 ? "Requires at least 1 bin" : "Latest data included"}
            onPress={handleGenerateReport}
            disabled={garbagePlaces.length === 0}
          />
        </View>

        {garbagePlaces.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="info" size={32} color="#94A3B8" />
            <Text style={styles.emptyText}>No waste bins registered yet</Text>
            <Text style={styles.emptySubtext}>Start by adding your first bin</Text>
          </View>
        )}
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
  headerContainer: {
    marginBottom: 32,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'right',
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
    marginBottom: 24,
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
  emptyState: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
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