import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  Linking, 
  SafeAreaView, 
  ActivityIndicator,
  Image
} from 'react-native';
import { FIREBASE_DB } from '../../../Firebase_Config';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AdminNav from '../../Components/AdminNav';
import Icon from 'react-native-vector-icons/MaterialIcons';
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

const PlaceView = ({ route }) => {
  const { id } = route.params;
  const [garbagePlace, setGarbagePlace] = useState<GarbagePlace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const fetchGarbagePlace = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const docRef = doc(FIREBASE_DB, 'GarbagePlaces', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setGarbagePlace({ id: docSnap.id, ...docSnap.data() } as GarbagePlace);
      } else {
        setError('Location not found');
      }
    } catch (error) {
      setError('Failed to load location details');
      console.error("Error fetching garbage place details: ", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchGarbagePlace();
    }, [fetchGarbagePlace])
  );

  const handleDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this location?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: confirmDelete }
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      const docRef = doc(FIREBASE_DB, 'GarbagePlaces', id);
      await deleteDoc(docRef);
      Alert.alert('Success', 'Location deleted successfully!');
      navigation.navigate('HomeG');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete location. Please try again.');
    }
  };

  const openInGoogleMaps = () => {
    if (!garbagePlace?.address) {
      Alert.alert('Error', 'No address provided');
      return;
    }
    
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(garbagePlace.address)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open maps app');
    });
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `${match[1]} ${match[2]} ${match[3]}` : phone;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading Location Details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={40} color="#ff4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchGarbagePlace}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>EcoBin Location Details</Text>

        <View style={styles.card}>
          <DetailRow 
            icon="place" 
            label="Location Name" 
            value={garbagePlace.locationName} 
          />
          
          <DetailRow 
            icon="location-pin" 
            label="Address" 
            value={garbagePlace.address} 
          />

          <TouchableOpacity 
            style={styles.mapButton} 
            onPress={openInGoogleMaps}
            accessibilityLabel="View location on map"
          >
            <Image
              source={{ uri: `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(garbagePlace.address)}&zoom=14&size=400x150&key=${process.env.GOOGLE_MAPS_API_KEY}` }}
              style={styles.mapImage}
            />
            <View style={styles.mapOverlay}>
              <Icon name="map" size={24} color="#FFF" />
              <Text style={styles.mapButtonText}>View in Maps</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.detailsGrid}>
            <DetailRow
              icon="storage"
              label="Capacity"
              value={`${garbagePlace.capacity} kg`}
              containerStyle={styles.detailBox}
            />
            <DetailRow
              icon="person"
              label="Contact Person"
              value={garbagePlace.contactPerson}
              containerStyle={styles.detailBox}
            />
            <DetailRow
              icon="phone"
              label="Contact Number"
              value={formatPhoneNumber(garbagePlace.phoneNumber)}
              containerStyle={styles.detailBox}
            />
            <DetailRow
              icon="delete"
              label="Waste Type"
              value={garbagePlace.wasteType}
              containerStyle={styles.detailBox}
            />
          </View>
        </View>

        <View style={styles.actionContainer}>
          <ActionButton 
            icon="edit" 
            label="Edit" 
            color="#007BFF" 
            onPress={() => navigation.navigate('EditPlace', { id })} 
          />
          <ActionButton 
            icon="delete" 
            label="Delete" 
            color="#DC3545" 
            onPress={handleDelete} 
          />
        </View>
      </ScrollView>
      <AdminNav />
    </SafeAreaView>
  );
};

const DetailRow = ({ icon, label, value, containerStyle }) => (
  <View style={[styles.detailRow, containerStyle]}>
    <Icon name={icon} size={20} color="#4CAF50" style={styles.detailIcon} />
    <View style={styles.detailTextContainer}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const ActionButton = ({ icon, label, color, onPress }) => (
  <TouchableOpacity 
    style={[styles.actionButton, { backgroundColor: color }]}
    onPress={onPress}
    accessibilityRole="button"
  >
    <Icon name={icon} size={20} color="#FFF" />
    <Text style={styles.actionButtonText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3A4B',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailIcon: {
    marginRight: 15,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#2D3A4B',
    fontWeight: '500',
  },
  mapButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 15,
  },
  mapImage: {
    height: 150,
    width: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(40, 167, 69, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  mapButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  detailBox: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '48%',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#F8F9FA',
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    marginTop: 15,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PlaceView;