import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native';
import { FIREBASE_DB } from '../../../Firebase_Config';
import { collection, getDocs } from 'firebase/firestore';
import CustomerNav from '../../Components/CustomerNav';

interface Complaint {
  id: string;
  fullName: string;
  complaintType: string;
  missedPickupDate: string;
  garbageType: string;
  garbageLocation: string;
  additionalDetails: string;
  status: string;
}

const ComplaintList: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const querySnapshot = await getDocs(collection(FIREBASE_DB, 'Complaints'));
        const complaintsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Complaint[];
        setComplaints(complaintsData);
        setFilteredComplaints(complaintsData);
      } catch (error) {
        console.error('Error fetching complaints: ', error);
      }
    };

    fetchComplaints();
  }, []);

  // Filter complaints based on search input
  useEffect(() => {
    const lower = searchText.toLowerCase();
    const filtered = complaints.filter(
      c =>
        c.fullName.toLowerCase().includes(lower) ||
        c.complaintType.toLowerCase().includes(lower) ||
        c.status.toLowerCase().includes(lower)
    );
    setFilteredComplaints(filtered);
  }, [searchText, complaints]);

  const renderItem = ({ item }: { item: Complaint }) => (
    <View style={styles.itemContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Complaint Details</Text>
        <Text style={[styles.statusValue, item.status === 'Resolved' ? styles.resolved : styles.pending]}>
          {item.status}
        </Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.itemText}>Full Name: <Text style={styles.itemValue}>{item.fullName}</Text></Text>
        <Text style={styles.itemText}>Complaint Type: <Text style={styles.itemValue}>{item.complaintType}</Text></Text>
        <Text style={styles.itemText}>Missed Pickup Date: <Text style={styles.itemValue}>{item.missedPickupDate}</Text></Text>
        <Text style={styles.itemText}>Garbage Type: <Text style={styles.itemValue}>{item.garbageType}</Text></Text>
        <Text style={styles.itemText}>Garbage Location: <Text style={styles.itemValue}>{item.garbageLocation}</Text></Text>
        <Text style={styles.itemText}>Additional Details: <Text style={styles.itemValue}>{item.additionalDetails}</Text></Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name, type, or status"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={filteredComplaints}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.navBar}>
        <CustomerNav />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  headerContainer: {
    borderBottomWidth: 2,
    borderBottomColor: '#00acc1',
    marginBottom: 8,
    paddingBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796b',
  },
  detailContainer: {
    paddingVertical: 8,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 8,
  },
  itemValue: {
    fontWeight: 'normal',
    color: '#004d40',
  },
  statusValue: {
    fontWeight: 'bold',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: 'hidden',
    textAlign: 'center',
  },
  resolved: {
    backgroundColor: '#006400',
    color: '#fff',
  },
  pending: {
    backgroundColor: '#FF4500',
    color: '#fff',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    margin: 16,
    fontSize: 16,
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ComplaintList;
