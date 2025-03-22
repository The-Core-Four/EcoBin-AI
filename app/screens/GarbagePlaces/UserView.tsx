import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking, SafeAreaView } from 'react-native';
import { FIREBASE_DB } from '../../../Firebase_Config';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CustomerNav from '../../Components/CustomerNav';
import Header from '../../Components/HeaderCustomer';

const UserView = ({ route }) => {
  const { id } = route.params;
  const [garbagePlace, setGarbagePlace] = useState(null);
  const navigation = useNavigation();

  const fetchGarbagePlace = useCallback(async () => {
    try {
      const docRef = doc(FIREBASE_DB, 'GarbagePlaces', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setGarbagePlace(docSnap.data());
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error("Error fetching garbage place details: ", error);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchGarbagePlace();
    }, [fetchGarbagePlace])
  );

  const openInGoogleMaps = () => {
    if (garbagePlace?.address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(garbagePlace.address)}`;
      Linking.openURL(url).catch(err => console.error('Error opening Google Maps', err));
    } else {
      Alert.alert("Error", "No address provided to open in Google Maps.");
    }
  };

  if (!garbagePlace) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Garbage Collection Point</Text>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Location Details</Text>
          
          <View style={styles.detailItem}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{garbagePlace.address}</Text>
          </View>

          <TouchableOpacity 
            style={styles.mapButton}
            onPress={openInGoogleMaps}
          >
            <Text style={styles.mapButtonText}>🗺️ View on Map</Text>
          </TouchableOpacity>

          <View style={styles.detailsContainer}>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.label}>Capacity</Text>
                <Text style={styles.value}>{garbagePlace.capacity}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.label}>Contact Person</Text>
                <Text style={styles.value}>{garbagePlace.contactPerson}</Text>
              </View>
            </View>

            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.label}>Phone Number</Text>
                <Text style={styles.value}>{garbagePlace.phoneNumber}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.label}>Waste Type</Text>
                <Text style={styles.value}>{garbagePlace.wasteType}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <CustomerNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    fontSize: 18,
    color: '#64748B',
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    borderBottomWidth: 2,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 12,
    marginBottom: 20,
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 12,
  },
  column: {
    flex: 1,
    gap: 16,
  },
  detailItem: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '600',
  },
  mapButton: {
    backgroundColor: '#28A745',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserView;