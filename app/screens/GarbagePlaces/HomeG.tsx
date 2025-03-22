import React, { useEffect, useState, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_DB } from '../../../Firebase_Config';
import { collection, onSnapshot } from 'firebase/firestore';
import AdminNav from '../../Components/AdminNav';
import Header from '../../Components/HeaderAdmin';

interface GarbagePlace {
  id: string;
  locationName: string;
  address: string;
  capacity: string;
  contactPerson: string;
  phoneNumber: string;
  wasteType: string;
}

const HomeG = () => {
  const [garbagePlaces, setGarbagePlaces] = useState<GarbagePlace[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<GarbagePlace[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchGarbagePlaces();
  }, []);

  const fetchGarbagePlaces = async () => {
    setLoading(true);
    try {
      const q = collection(FIREBASE_DB, 'GarbagePlaces');
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const placesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as GarbagePlace[];
        setGarbagePlaces(placesData);
        setFilteredPlaces(placesData);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching garbage places: ', error);
      setLoading(false);
    }
  };

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text === '') {
      setFilteredPlaces(garbagePlaces);
    } else {
      const filtered = garbagePlaces.filter((place) =>
        place.address.toLowerCase().includes(text.toLowerCase()) ||
        place.locationName.toLowerCase().includes(text.toLowerCase()) ||
        place.wasteType.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPlaces(filtered);
    }
  };

  const debouncedSearch = useCallback(debounce(handleSearch, 300), [garbagePlaces]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGarbagePlaces().finally(() => setRefreshing(false));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.layout}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.h1d}>Garbage Disposal Places</Text>
        <TextInput
          style={styles.search}
          placeholder="Search by address, location or waste type"
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            debouncedSearch(text);
          }}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 50 }} />
        ) : (
          <View style={styles.mainframe}>
            {filteredPlaces.length > 0 ? (
              filteredPlaces.map((place) => (
                <TouchableOpacity
                  key={place.id}
                  style={styles.frame}
                  onPress={() => navigation.navigate('PlaceView', { id: place.id })}
                  activeOpacity={0.8}
                >
                  <Text style={styles.ss1}>{place.locationName}</Text>
                  <Text style={styles.ss2}>{place.address}</Text>
                  <View style={styles.btn1}>
                    <Text style={styles.btntxt1}>View</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={{ alignItems: 'center', marginTop: 50 }}>
                <Text>No matching garbage places found.</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
      <AdminNav />
    </SafeAreaView>
  );
};

export default HomeG;

const styles = StyleSheet.create({
  layout: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5', // Use light background
  },
  h1d: {
    fontWeight: '700',
    fontSize: 24,
    textAlign: 'center',
    color: '#333333', // Darker text color
    marginBottom: 20,
  },
  search: {
    width: '100%',
    height: 45,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderColor: '#DDD',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  mainframe: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  frame: {
    width: '100%',
    backgroundColor: '#FFFFFF', // White card background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    justifyContent: 'space-between',
    elevation: 3, // Android shadow
  },
  btn1: {
    width: 80,
    height: 36,
    backgroundColor: '#4CAF50', // Green button
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 15,
  },
  btntxt1: {
    fontWeight: '500',
    fontSize: 16,
    color: '#FFFFFF',
  },
  ss1: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 10,
    color: '#333333',
  },
  ss2: {
    fontWeight: '400',
    fontSize: 16,
    color: '#666666',
  },
});
