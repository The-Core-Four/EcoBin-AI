import { ScrollView, StyleSheet, Text, TextInput, View, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_DB } from '../../../Firebase_Config';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import AdminNav from '../../Components/AdminNav';
import Header from '../../Components/HeaderAdmin';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  HomeG: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeG'>;

const AddGarbagePlace = () => {
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');
  const [wasteType, setWasteType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const navigation = useNavigation<NavigationProp>();

  const validateInputs = () => {
    if (!locationName.trim()) {
      Alert.alert('Validation Error', 'Location Name is required');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('Validation Error', 'Address is required');
      return false;
    }
    if (!wasteType.trim()) {
      Alert.alert('Validation Error', 'Type of Waste is required');
      return false;
    }
    if (!capacity.trim()) {
      Alert.alert('Validation Error', 'Capacity is required and must be a number');
      return false;
    }
    if (!contactPerson.trim()) {
      Alert.alert('Validation Error', 'Contact Person is required');
      return false;
    }
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      Alert.alert('Validation Error', 'Valid Phone Number is required');
      return false;
    }
    return true;
  };

  const addPlaceToFirestore = async () => {
    if (!validateInputs()) {
      return;
    }

    const newPlace = {
      locationName,
      address,
      wasteType,
      capacity,
      contactPerson,
      phoneNumber,
    };

    try {
      await addDoc(collection(FIREBASE_DB, 'GarbagePlaces'), newPlace);
      setLocationName('');
      setAddress('');
      setWasteType('');
      setCapacity('');
      setContactPerson('');
      setPhoneNumber('');
      Alert.alert('Success', 'Place added successfully!');
      navigation.navigate('HomeG');
    } catch (error) {
      console.error('Error adding place: ', error);
      Alert.alert('Error', 'Failed to add place. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Add New Garbage Location</Text>
        <View style={styles.form}>
          <Input label="Location Name" value={locationName} setValue={setLocationName} />
          <Input label="Address" value={address} setValue={setAddress} />
          <Input label="Type of Waste" value={wasteType} setValue={setWasteType} />
          <Input label="Capacity" value={capacity} setValue={setCapacity} keyboardType="numeric" />
          <Input label="Contact Person" value={contactPerson} setValue={setContactPerson} />
          <Input label="Contact Number" value={phoneNumber} setValue={setPhoneNumber} keyboardType="numeric" />
        </View>
        <TouchableOpacity style={styles.button} onPress={addPlaceToFirestore}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
      <AdminNav />
    </SafeAreaView>
  );
};

const Input = ({ label, value, setValue, keyboardType = 'default' }) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={setValue}
      placeholder={`Enter ${label.toLowerCase()}`}
      keyboardType={keyboardType}
    />
  </>
);

export default AddGarbagePlace;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  header: {
    fontWeight: '700',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#111827',
  },
  form: {
    backgroundColor: '#E0F2E9',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 5,
  },
  input: {
    height: 45,
    borderColor: '#CBD5E1',
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#10B981',
    padding: 14,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
    width: '60%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
