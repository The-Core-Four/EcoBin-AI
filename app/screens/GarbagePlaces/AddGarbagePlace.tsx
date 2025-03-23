import { ScrollView, StyleSheet, Text, TextInput, View, Alert, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_DB } from '../../../Firebase_Config';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import AdminNav from '../../Components/AdminNav';
import Header from '../../Components/HeaderAdmin';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

type RootStackParamList = {
  HomeG: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeG'>;

interface GarbagePlace {
  locationName: string;
  address: string;
  wasteType: string;
  capacity: string;
  contactPerson: string;
  phoneNumber: string;
}

const AddGarbagePlace = () => {
  const [formData, setFormData] = useState<GarbagePlace>({
    locationName: '',
    address: '',
    wasteType: '',
    capacity: '',
    contactPerson: '',
    phoneNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const navigation = useNavigation<NavigationProp>();

  // Validate phone number with multiple checks
  const validatePhoneNumber = (phone: string): string | null => {
    // Check if empty
    if (!phone.trim()) return 'Phone number is required';
    
    // Remove any formatting spaces
    const rawPhone = phone.replace(/\s/g, '');
    
    // Check length (should be 10 digits including leading 0)
    if (rawPhone.length !== 10) return 'Must be 10 digits';
    
    // Check if starts with 0
    if (!rawPhone.startsWith('0')) return 'Must start with 0';
    
    // Check if all characters are digits
    if (!/^\d+$/.test(rawPhone)) return 'Only numbers allowed';
    
    // Check valid Sri Lankan mobile operator prefixes
    const validPrefixes = ['070', '071', '072', '074', '075', '076', '077', '078'];
    const prefix = rawPhone.substring(0, 3);
    if (!validPrefixes.includes(prefix)) return 'Invalid mobile prefix';
    
    return null;
  };

  const validateInputs = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    // Location Name validation
    if (!formData.locationName.trim()) {
      errors.locationName = 'Location name is required';
      isValid = false;
    } else if (!/^[A-Za-z\s\-']+$/.test(formData.locationName.trim())) {
      errors.locationName = 'Invalid characters in location name';
      isValid = false;
    }

    // Address validation
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
      isValid = false;
    }

    // Waste Type validation
    if (!formData.wasteType.trim()) {
      errors.wasteType = 'Waste type is required';
      isValid = false;
    }

    // Capacity validation
    if (!formData.capacity) {
      errors.capacity = 'Capacity is required';
      isValid = false;
    } else if (isNaN(Number(formData.capacity)) || Number(formData.capacity) <= 0) {
      errors.capacity = 'Invalid capacity value';
      isValid = false;
    }

    // Contact Person validation
    if (!formData.contactPerson.trim()) {
      errors.contactPerson = 'Contact person is required';
      isValid = false;
    } else if (!/^[A-Za-z\s\-'.]+$/.test(formData.contactPerson.trim())) {
      errors.contactPerson = 'Invalid name format';
      isValid = false;
    }

    // Phone Number validation
    const phoneError = validatePhoneNumber(formData.phoneNumber);
    if (phoneError) {
      errors.phoneNumber = phoneError;
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleInputChange = (field: keyof GarbagePlace, value: string) => {
    // Format phone number while typing
    if (field === 'phoneNumber') {
      // Remove all non-digit characters
      const cleaned = value.replace(/\D/g, '');
      // Format as 077 123 4567
      const formatted = cleaned
        .slice(0, 10)
        .replace(/(\d{3})(\d{0,3})(\d{0,4})/, (_, p1, p2, p3) => {
          let result = p1;
          if (p2) result += ` ${p2}`;
          if (p3) result += ` ${p3}`;
          return result;
        });
      value = formatted;
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addPlaceToFirestore = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      // Remove formatting spaces from phone number before saving
      const dataToSave = {
        ...formData,
        phoneNumber: formData.phoneNumber.replace(/\s/g, '')
      };

      await addDoc(collection(FIREBASE_DB, 'GarbagePlaces'), dataToSave);
      Alert.alert('Success', 'EcoBin location added successfully!');
      navigation.navigate('HomeG');
    } catch (error) {
      console.error('Error adding place: ', error);
      Alert.alert('Error', 'Failed to add location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Add New EcoBin Location</Text>

        <View style={styles.form}>
          <Input
            label="Location Name"
            icon="place"
            value={formData.locationName}
            onChange={(v) => handleInputChange('locationName', v)}
            error={validationErrors.locationName}
            placeholder="EcoBin Central Hub"
          />

          <Input
            label="Address"
            icon="location-pin"
            value={formData.address}
            onChange={(v) => handleInputChange('address', v)}
            error={validationErrors.address}
            placeholder="123 Green Street"
          />

          <Input
            label="Type of Waste"
            icon="delete"
            value={formData.wasteType}
            onChange={(v) => handleInputChange('wasteType', v)}
            error={validationErrors.wasteType}
            placeholder="Recyclables, Organic, etc."
          />

          <Input
            label="Capacity (kg)"
            icon="storage"
            value={formData.capacity}
            onChange={(v) => handleInputChange('capacity', v)}
            keyboardType="numeric"
            error={validationErrors.capacity}
            placeholder="500"
            maxLength={4}
          />

          <Input
            label="Contact Person"
            icon="person"
            value={formData.contactPerson}
            onChange={(v) => handleInputChange('contactPerson', v)}
            error={validationErrors.contactPerson}
            placeholder="John Doe"
          />

          <Input
            label="Contact Number"
            icon="phone"
            value={formData.phoneNumber}
            onChange={(v) => handleInputChange('phoneNumber', v)}
            keyboardType="phone-pad"
            error={validationErrors.phoneNumber}
            placeholder="077 123 4567"
            maxLength={12} // 10 digits + 2 spaces
            format="phone"
          />
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={addPlaceToFirestore}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <View style={styles.buttonContent}>
              <Icon name="add-location" size={20} color="#FFF" />
              <Text style={styles.buttonText}>Add EcoBin Location</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
      <AdminNav />
    </SafeAreaView>
  );
};

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad';
  maxLength?: number;
  error?: string;
  icon?: string;
  format?: 'phone';
}

const Input: React.FC<InputProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder = '', 
  keyboardType = 'default', 
  maxLength,
  error,
  icon,
  format
}) => {
  const getInputStyle = () => {
    if (error) return [styles.input, styles.inputError];
    if (format === 'phone' && value.length === 12) return [styles.input, styles.inputValid];
    return styles.input;
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        {icon && <Icon name={icon} size={18} color="#64748B" style={styles.icon} />}
        <Text style={styles.label}>{label}</Text>
      </View>
      
      <TextInput
        style={getInputStyle()}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
      
      {format === 'phone' && value.length > 0 && (
        <View style={styles.phoneMeta}>
          <Text style={styles.charCounter}>{value.replace(/\D/g, '').length}/10</Text>
          {error ? (
            <Icon name="error" size={18} color="#DC2626" />
          ) : value.length === 12 ? (
            <Icon name="check-circle" size={18} color="#16A34A" />
          ) : null}
        </View>
      )}
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

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
  inputContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  input: {
    height: 48,
    borderColor: '#CBD5E1',
    borderWidth: 1,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  inputValid: {
    borderColor: '#16A34A',
    backgroundColor: '#F0FDF4',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
    minWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  phoneMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  charCounter: {
    fontSize: 12,
    color: '#64748B',
  },
});

export default AddGarbagePlace;