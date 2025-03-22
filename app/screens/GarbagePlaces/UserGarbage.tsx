import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_DB } from '../../../Firebase_Config';
import { collection, onSnapshot } from 'firebase/firestore';
import CustomerNav from '../../Components/CustomerNav';
import Header from '../../Components/HeaderCustomer';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';

const UserGarbage = () => {
  const [garbagePlaces, setGarbagePlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchGarbagePlaces = async () => {
      try {
        const q = collection(FIREBASE_DB, 'GarbagePlaces');
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const placesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setGarbagePlaces(placesData);
          setFilteredPlaces(placesData);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching garbage places: ', error);
      }
    };
    fetchGarbagePlaces();
  }, []);

  const fetchCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access location was denied.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    if (location) {
      const { latitude, longitude } = location.coords;
      const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (reverseGeocode.length > 0) {
        const locationName = `${reverseGeocode[0].city}`;
        setSearchText(locationName);
        const matchingPlaces = garbagePlaces.filter((place) =>
          place.address.toLowerCase().includes(locationName.toLowerCase())
        );
        matchingPlaces.length > 0 
          ? setFilteredPlaces(matchingPlaces)
          : Alert.alert('No Matches', 'No garbage places found for your current location.');
      }
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = text === '' 
      ? garbagePlaces 
      : garbagePlaces.filter((place) =>
          place.address.toLowerCase().includes(text.toLowerCase())
        );
    setFilteredPlaces(filtered);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Garbage Disposal Points</Text>

        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by address..."
            placeholderTextColor="#94A3B8"
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>

        <TouchableOpacity style={styles.locationButton} onPress={fetchCurrentLocation}>
          <Icon name="my-location" size={20} color="#FFF" />
          <Text style={styles.locationButtonText}>Use Current Location</Text>
        </TouchableOpacity>

        <View style={styles.resultsContainer}>
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map((place) => (
              <TouchableOpacity
                key={place.id}
                style={styles.locationCard}
                onPress={() => navigation.navigate('UserView', { id: place.id })}
              >
                <Icon name="place" size={24} color="#28A745" style={styles.cardIcon} />
                <View style={styles.cardContent}>
                  <Text style={styles.locationAddress}>{place.address}</Text>
                  <View style={styles.detailsRow}>
                    <Text style={styles.capacityBadge}>{place.capacity} capacity</Text>
                    <Text style={styles.wasteType}>{place.wasteType}</Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={24} color="#CBD5E1" />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="location-off" size={40} color="#CBD5E1" />
              <Text style={styles.emptyText}>No locations found</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <CustomerNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    padding: 24,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 28,
    textAlign: 'center',
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingLeft: 48,
    paddingRight: 20,
    fontSize: 16,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28A745',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  locationButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardIcon: {
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
    marginRight: 12,
  },
  locationAddress: {
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 8,
    fontWeight: '500',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  capacityBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  wasteType: {
    fontSize: 12,
    color: '#28A745',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 12,
    fontWeight: '500',
  },
});

export default UserGarbage;