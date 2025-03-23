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
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_DB } from '../../../Firebase_Config';
import { collection, onSnapshot } from 'firebase/firestore';
import AdminNav from '../../Components/AdminNav';
import Header from '../../Components/HeaderAdmin';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { debounce } from 'lodash';

interface GarbagePlace {
  id: string;
  locationName: string;
  address: string;
  capacity: string;
  contactPerson: string;
  phoneNumber: string;
  wasteType: string;
}

const skeletonData = Array(4).fill({});

const HomeG = () => {
  const [garbagePlaces, setGarbagePlaces] = useState<GarbagePlace[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<GarbagePlace[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0];
  const navigation = useNavigation();

  useEffect(() => {
    fetchGarbagePlaces();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchGarbagePlaces = async () => {
    try {
      setError('');
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
      setError('Failed to load garbage places. Please try again.');
      setLoading(false);
      console.error('Error fetching garbage places: ', error);
    }
  };

  const handleSearch = useCallback(
    debounce((text: string) => {
      if (text === '') {
        setFilteredPlaces(garbagePlaces);
      } else {
        const searchTerms = text.toLowerCase().split(' ');
        const filtered = garbagePlaces.filter((place) =>
          searchTerms.every(term =>
            place.address.toLowerCase().includes(term) ||
            place.locationName.toLowerCase().includes(term) ||
            place.wasteType.toLowerCase().includes(term)
          )
        );
        setFilteredPlaces(filtered);
      }
    }, 250),
    [garbagePlaces]
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGarbagePlaces();
    setRefreshing(false);
  };

  const getWasteTypeIcon = (wasteType: string) => {
    const type = wasteType.toLowerCase();
    if (type.includes('recycl')) return 'recycling';
    if (type.includes('organic')) return 'compost';
    if (type.includes('hazard')) return 'warning';
    return 'delete';
  };

  const renderItem = (place: GarbagePlace) => (
    <TouchableOpacity
      key={place.id}
      style={styles.card}
      onPress={() => navigation.navigate('PlaceView', { id: place.id })}
      activeOpacity={0.8}
      accessibilityLabel={`View details for ${place.locationName}`}
    >
      <View style={styles.cardHeader}>
        <Icon
          name={getWasteTypeIcon(place.wasteType)}
          size={24}
          color="#4CAF50"
          style={styles.cardIcon}
        />
        <Text style={styles.cardTitle}>{place.locationName}</Text>
        <View style={styles.capacityBadge}>
          <Text style={styles.capacityText}>{place.capacity}kg</Text>
        </View>
      </View>
      
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Icon name="place" size={18} color="#666" />
          <Text style={styles.cardSubtext}>{place.address}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Icon name="person" size={18} color="#666" />
          <Text style={styles.cardSubtext}>{place.contactPerson}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.wasteTypeBadge}>{place.wasteType}</Text>
        <Icon name="chevron-right" size={24} color="#4CAF50" />
      </View>
    </TouchableOpacity>
  );

  const renderSkeleton = () => (
    <Animated.View style={[styles.skeletonCard, { opacity: fadeAnim }]}>
      <View style={styles.skeletonHeader} />
      <View style={styles.skeletonBody} />
      <View style={styles.skeletonFooter} />
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4CAF50"
            colors={['#4CAF50']}
          />
        }
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>EcoBin Locations</Text>
          <Text style={styles.subHeaderText}>Manage garbage collection points</Text>
        </View>

        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              handleSearch(text);
            }}
            accessibilityLabel="Search garbage locations"
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setSearchText('');
                setFilteredPlaces(garbagePlaces);
              }}
            >
              <Icon name="close" size={18} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={40} color="#ff4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : loading ? (
          <View style={styles.skeletonContainer}>
            {skeletonData.map((_, index) => (
              <View key={index}>{renderSkeleton()}</View>
            ))}
          </View>
        ) : filteredPlaces.length > 0 ? (
          <View style={styles.listContainer}>
            {filteredPlaces.map(renderItem)}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="location-off" size={60} color="#ddd" />
            <Text style={styles.emptyText}>No matching locations found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search terms</Text>
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
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  headerContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3A4B',
    marginBottom: 4,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 8,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3A4B',
    flex: 1,
  },
  capacityBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  capacityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4CAF50',
  },
  cardBody: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardSubtext: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 16,
  },
  wasteTypeBadge: {
    backgroundColor: '#F0F4F8',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
  skeletonContainer: {
    paddingHorizontal: 20,
  },
  skeletonCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  skeletonHeader: {
    height: 20,
    width: '60%',
    backgroundColor: '#EEE',
    borderRadius: 4,
    marginBottom: 16,
  },
  skeletonBody: {
    height: 16,
    width: '80%',
    backgroundColor: '#EEE',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonFooter: {
    height: 16,
    width: '40%',
    backgroundColor: '#EEE',
    borderRadius: 4,
    marginTop: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#CCC',
    marginTop: 8,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default HomeG;