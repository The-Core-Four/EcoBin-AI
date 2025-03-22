import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking, SafeAreaView } from 'react-native';
import { FIREBASE_DB } from '../../../Firebase_Config';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AdminNav from '../../Components/AdminNav';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../../Components/HeaderAdmin';

const PlaceView = ({ route }) => {
  const { id } = route.params;
  const [garbagePlace, setGarbagePlace] = useState(null);
  const navigation = useNavigation();

  // Fetch the garbage place details from Firestore
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

  const handleDelete = async () => {
    try {
      const docRef = doc(FIREBASE_DB, 'GarbagePlaces', id);
      await deleteDoc(docRef);
      Alert.alert('Success', 'Garbage place deleted successfully!');
      navigation.navigate('HomeG');
    } catch (error) {
      Alert.alert('Error', 'Error deleting garbage place: ' + error.message);
    }
  };

  if (!garbagePlace) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const openInGoogleMaps = () => {
    if (garbagePlace.address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(garbagePlace.address)}`;
      Linking.openURL(url).catch(err => console.error('Error opening Google Maps', err));
    } else {
      alert("No address provided to open in Google Maps.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.layoutgd}>
        <Text style={styles.header}>Garbage Location Details</Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Location Name:</Text>
            <Text style={styles.value}>{garbagePlace.locationName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{garbagePlace.address}</Text>
          </View>
          <TouchableOpacity style={styles.mapButton} onPress={openInGoogleMaps}>
            <Text style={styles.mapButtonText}>View on Map</Text>
          </TouchableOpacity>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Capacity:</Text>
            <Text style={styles.value}>{garbagePlace.capacity}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Contact Person:</Text>
            <Text style={styles.value}>{garbagePlace.contactPerson}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone Number:</Text>
            <Text style={styles.value}>{garbagePlace.phoneNumber}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditPlace', { id })}>
            <Icon name="edit" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Icon name="delete" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <AdminNav />
    </SafeAreaView>
  );
};

export default PlaceView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  layoutgd: {
    padding: 20,
    backgroundColor: '#EFF6F0',
  },
  header: {
    fontWeight: '700',
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#C2E0C0',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 2,
    flexWrap: 'wrap',
  },
  mapButton: {
    backgroundColor: '#28A745',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  mapButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#007BFF',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 0.45,
  },
  deleteButton: {
    backgroundColor: '#DC3545',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 0.45,
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
