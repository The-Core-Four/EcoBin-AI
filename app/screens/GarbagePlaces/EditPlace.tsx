import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  View, 
  TouchableOpacity, 
  Alert, 
  SafeAreaView, 
  ActivityIndicator 
} from 'react-native';
import { FIREBASE_DB } from '../../../Firebase_Config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import AdminNav from '../../Components/AdminNav';
import Header from '../../Components/HeaderAdmin';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface EditPlaceProps {
  route: any;
  navigation: any;
}

interface FormState {
  locationName: string;
  address: string;
  wasteType: string;
  capacity: string;
  contactPerson: string;
  phoneNumber: string;
}

const EditPlace: React.FC<EditPlaceProps> = ({ route, navigation }) => {
  const { id } = route.params;
  const [formState, setFormState] = useState<FormState>({
    locationName: '',
    address: '',
    wasteType: '',
    capacity: '',
    contactPerson: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchGarbagePlace = async () => {
      setLoading(true);
      try {
        const docRef = doc(FIREBASE_DB, 'GarbagePlaces', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormState({
            locationName: data.locationName,
            address: data.address,
            wasteType: data.wasteType,
            capacity: data.capacity.toString(),
            contactPerson: data.contactPerson,
            phoneNumber: data.phoneNumber
          });
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load location details');
      } finally {
        setLoading(false);
      }
    };

    fetchGarbagePlace();
  }, [id]);

  const validateField = (name: string, value: string) => {
    let error = '';
    
    switch (name) {
      case 'locationName':
        if (!value.trim()) error = 'Location name is required';
        else if (!/^[A-Za-z\s\-']+$/.test(value)) 
          error = 'Invalid characters in location name';
        break;
        
      case 'address':
        if (!value.trim()) error = 'Address is required';
        break;
        
      case 'wasteType':
        if (!value.trim()) error = 'Waste type is required';
        break;
        
      case 'capacity':
        if (!value) error = 'Capacity is required';
        else if (isNaN(Number(value)) || Number(value) <= 0) 
          error = 'Must be a positive number';
        break;
        
      case 'contactPerson':
        if (!value.trim()) error = 'Contact person is required';
        else if (!/^[A-Za-z\s\-'.]+$/.test(value)) 
          error = 'Invalid name format';
        break;
        
      case 'phoneNumber':
        const phoneError = validatePhoneNumber(value);
        if (phoneError) error = phoneError;
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const validatePhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (!cleaned) return 'Phone number is required';
    if (cleaned.length !== 10) return 'Must be 10 digits';
    if (!cleaned.startsWith('0')) return 'Must start with 0';
    if (!/^\d+$/.test(cleaned)) return 'Only numbers allowed';
    
    const validPrefixes = ['070', '071', '072', '074', '075', '076', '077', '078'];
    const prefix = cleaned.substring(0, 3);
    if (!validPrefixes.includes(prefix)) return 'Invalid mobile prefix';
    
    return '';
  };

  const handleChange = (name: keyof FormState, value: string) => {
    if (name === 'phoneNumber') {
      const formatted = value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d{0,3})(\d{0,4})/, (_, p1, p2, p3) => {
          let result = p1;
          if (p2) result += ` ${p2}`;
          if (p3) result += ` ${p3}`;
          return result;
        })
        .slice(0, 12);
      value = formatted;
    }
    
    setFormState(prev => ({ ...prev, [name]: value }));
    if (errors[name]) validateField(name, value);
  };

  const handleSubmit = async () => {
    const validations = Object.entries(formState).map(([key, value]) => 
      validateField(key, value)
    );
    
    if (validations.every(v => v)) {
      setSubmitting(true);
      try {
        await updateDoc(doc(FIREBASE_DB, 'GarbagePlaces', id), formState);
        Alert.alert('Success', 'Location updated successfully!');
        navigation.goBack();
      } catch (error) {
        Alert.alert('Error', 'Failed to update location. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28A745" />
        <Text style={styles.loadingText}>Loading Location Details...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Edit EcoBin Location</Text>
        
        <View style={styles.formContainer}>
          <FormInput
            label="Location Name"
            icon="place"
            value={formState.locationName}
            onChange={(v) => handleChange('locationName', v)}
            error={errors.locationName}
          />
          
          <FormInput
            label="Address"
            icon="location-pin"
            value={formState.address}
            onChange={(v) => handleChange('address', v)}
            error={errors.address}
          />
          
          <FormInput
            label="Waste Type"
            icon="delete"
            value={formState.wasteType}
            onChange={(v) => handleChange('wasteType', v)}
            error={errors.wasteType}
          />
          
          <FormInput
            label="Capacity (kg)"
            icon="storage"
            value={formState.capacity}
            onChange={(v) => handleChange('capacity', v)}
            keyboardType="numeric"
            error={errors.capacity}
          />
          
          <FormInput
            label="Contact Person"
            icon="person"
            value={formState.contactPerson}
            onChange={(v) => handleChange('contactPerson', v)}
            error={errors.contactPerson}
          />
          
          <FormInput
            label="Contact Number"
            icon="phone"
            value={formState.phoneNumber}
            onChange={(v) => handleChange('phoneNumber', v)}
            keyboardType="phone-pad"
            error={errors.phoneNumber}
            maxLength={12}
          />
        </View>

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Icon name="save" size={20} color="#FFF" />
              <Text style={styles.submitButtonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
      <AdminNav />
    </SafeAreaView>
  );
};

const FormInput = ({ 
  label, 
  icon, 
  value, 
  onChange, 
  error, 
  keyboardType = 'default', 
  maxLength 
}) => (
  <View style={styles.inputContainer}>
    <View style={styles.labelContainer}>
      <Icon name={icon} size={18} color="#666" />
      <Text style={styles.inputLabel}>{label}</Text>
    </View>
    
    <TextInput
      style={[styles.input, error && styles.inputError]}
      value={value}
      onChangeText={onChange}
      keyboardType={keyboardType}
      maxLength={maxLength}
    />
    
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
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
    textAlign: 'center',
    marginBottom: 25,
  },
  formContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2D3A4B',
    backgroundColor: '#FFF',
  },
  inputError: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28A745',
    borderRadius: 10,
    padding: 16,
    marginTop: 25,
    gap: 12,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
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
});

export default EditPlace;