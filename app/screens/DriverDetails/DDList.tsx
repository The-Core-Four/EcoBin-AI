import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { FIREBASE_DB } from '../../../Firebase_Config';
import { collection, getDocs } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import AdminNav from '../../Components/AdminNav';
import Header from '../../Components/HeaderAdmin';

interface DriverDetail {
  id: string;
  driverName: string;
  vehicleNumber: string;
  partnerName: string;
  vehicleType: string;
  capacity: string;
  collectingArea: string;
  arrivalTime: string;
  leavingTime: string;
  cdate: string;
}

const DDList: React.FC = () => {
  const [driverDetails, setDriverDetails] = useState<DriverDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const querySnapshot = await getDocs(collection(FIREBASE_DB, 'DriverDetails'));
        const details = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as DriverDetail[];
        setDriverDetails(details);
      } catch (error) {
        console.error('Error fetching driver details: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverDetails();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Text style={styles.title}>Driver Details</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
          {driverDetails.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.driverName}>{item.driverName}</Text>
                <Text style={styles.date}>{new Date(item.cdate).toLocaleDateString()}</Text>
              </View>
              <Text style={styles.vehicleNumber}>{item.vehicleNumber}</Text>
              <View style={styles.detailsRow}>
                <MaterialIcons name="person" size={20} color="#4CAF50" />
                <Text style={styles.cardText}>Partner: {item.partnerName}</Text>
              </View>
              <View style={styles.detailsRow}>
                <MaterialIcons name="directions-car" size={20} color="#4CAF50" />
                <Text style={styles.cardText}>Type: {item.vehicleType}</Text>
              </View>
              <View style={styles.detailsRow}>
                <MaterialIcons name="speed" size={20} color="#4CAF50" />
                <Text style={styles.cardText}>Capacity: {item.capacity} Tons</Text>
              </View>
              <View style={styles.detailsRow}>
                <MaterialIcons name="location-on" size={20} color="#4CAF50" />
                <Text style={styles.cardText}>Area: {item.collectingArea}</Text>
              </View>
              <View style={styles.detailsRow}>
                <MaterialIcons name="access-time" size={20} color="#4CAF50" />
                <Text style={styles.cardText}>Arrival: {item.arrivalTime} - Leaving: {item.leavingTime}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      <AdminNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  scrollView: {
    padding: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginVertical: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  date: {
    fontSize: 14,
    color: '#555',
  },
  vehicleNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#1B5E20',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
});

export default DDList;
