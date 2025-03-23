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
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Add New EcoBin</Text>

        <View style={styles.formContainer}>
          <Input
            label="Location Name"
            icon="location-on"
            value={formData.locationName}
            onChange={(v) => handleInputChange('locationName', v)}
            error={validationErrors.locationName}
            placeholder="Central Recycling Hub"
          />

          <Input
            label="Full Address"
            icon="place"
            value={formData.address}
            onChange={(v) => handleInputChange('address', v)}
            error={validationErrors.address}
            placeholder="123 Green Street, EcoCity"
          />

          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Input
                label="Waste Type"
                icon="delete"
                value={formData.wasteType}
                onChange={(v) => handleInputChange('wasteType', v)}
                error={validationErrors.wasteType}
                placeholder="Plastic, Organic, etc."
              />
            </View>
            <View style={styles.inputGroup}>
              <Input
                label="Capacity (kg)"
                icon="storage"
                value={formData.capacity}
                onChange={(v) => handleInputChange('capacity', v)}
                keyboardType="numeric"
                error={validationErrors.capacity}
                placeholder="500"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Input
                label="Contact Person"
                icon="person"
                value={formData.contactPerson}
                onChange={(v) => handleInputChange('contactPerson', v)}
                error={validationErrors.contactPerson}
                placeholder="John Doe"
              />
            </View>
            <View style={styles.inputGroup}>
              <Input
                label="Contact Number"
                icon="phone"
                value={formData.phoneNumber}
                onChange={(v) => handleInputChange('phoneNumber', v)}
                keyboardType="phone-pad"
                error={validationErrors.phoneNumber}
                placeholder="077 123 4567"
                format="phone"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={addPlaceToFirestore}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Icon name="add-location" size={20} color="#FFF" />
              <Text style={styles.submitButtonText}>Add EcoBin Location</Text>
            </>
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
  const isPhoneValid = format === 'phone' && value.length === 12;

  return (
    <View style={styles.inputWrapper}>
      <View style={styles.labelRow}>
        {icon && <Icon name={icon} size={16} color="#64748B" />}
        <Text style={styles.inputLabel}>{label}</Text>
      </View>
      
      <View style={[
        styles.inputContainer,
        error && styles.inputErrorContainer,
        isPhoneValid && styles.inputValidContainer
      ]}>
        <TextInput
          style={styles.inputField}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          keyboardType={keyboardType}
          maxLength={maxLength}
        />
        
        {format === 'phone' && (
          <View style={styles.phoneStatus}>
            {error ? (
              <Icon name="error" size={16} color="#DC2626" />
            ) : isPhoneValid ? (
              <Icon name="check-circle" size={16} color="#16A34A" />
            ) : null}
          </View>
        )}
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={14} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 24,
    paddingBottom: 80,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#059669',
    textAlign: 'center',
    marginBottom: 32,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
  },
  inputField: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#1E293B',
  },
  inputErrorContainer: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  inputValidContainer: {
    borderColor: '#16A34A',
    backgroundColor: '#F0FDF4',
  },
  phoneStatus: {
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    padding: 18,
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddGarbagePlace;