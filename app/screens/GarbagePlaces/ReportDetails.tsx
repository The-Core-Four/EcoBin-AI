import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  Linking, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../../Components/HeaderAdmin';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../Firebase_Config';
import { doc, getDoc } from 'firebase/firestore';

interface GarbagePlace {
  id: string;
  locationName: string;
  address: string;
  capacity: string;
  contactPerson: string;
  phoneNumber: string;
  wasteType: string;
}

interface DetailItemProps {
  icon: string;
  label: string;
  value: string;
}

const DEFAULT_COMPANY_DATA = {
  name: 'EcoBin AI Waste Management',
  address: '123 Eco Park Road, Green City',
  phone: '(94) 112-456789',
  email: 'info@ecobin.ai',
  logoURL: 'https://example.com/default-logo.png'
};

const ReportDetails = () => {
  const route = useRoute();
  const { garbagePlaces = [] } = route.params as { garbagePlaces: GarbagePlace[] };
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!FIREBASE_AUTH.currentUser) {
      Alert.alert('Session Expired', 'Please login again', [
        { text: 'OK', onPress: () => FIREBASE_AUTH.signOut() }
      ]);
    }
    setAuthChecked(true);
  }, []);

  const generatePDF = async () => {
    if (!FIREBASE_AUTH.currentUser) return;
    
    setGeneratingPDF(true);
    try {
      const companyRef = doc(FIREBASE_DB, 'company/EcoBinAI');
      const companySnap = await getDoc(companyRef);

      const companyData = companySnap.exists() 
        ? { ...companySnap.data(), logoURL: companySnap.data().logoURL || DEFAULT_COMPANY_DATA.logoURL }
        : DEFAULT_COMPANY_DATA;

      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial; margin: 20px; }
              header { border-bottom: 2px solid #10B981; padding-bottom: 20px; margin-bottom: 30px; }
              .logo { height: 80px; margin-right: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
              th { background-color: #f8fafc; }
            </style>
          </head>
          <body>
            <header>
              ${companyData.logoURL ? `<img src="${companyData.logoURL}" class="logo">` : ''}
              <div>
                <h1>${companyData.name}</h1>
                <p>${companyData.address}</p>
                <p>Tel: ${companyData.phone} | Email: ${companyData.email}</p>
              </div>
            </header>
            
            <h2>Garbage Collection Points Report</h2>
            <p>Generated: ${new Date().toLocaleString()}</p>

            <table>
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Address</th>
                  <th>Capacity</th>
                  <th>Contact</th>
                  <th>Phone</th>
                  <th>Waste Type</th>
                </tr>
              </thead>
              <tbody>
                ${garbagePlaces.map(place => `
                  <tr>
                    <td>${place.locationName}</td>
                    <td>${place.address}</td>
                    <td>${place.capacity}kg</td>
                    <td>${place.contactPerson}</td>
                    <td>${place.phoneNumber}</td>
                    <td>${place.wasteType}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          dialogTitle: 'Share EcoBin Report',
          mimeType: 'application/pdf'
        });
      }
    } catch (error) {
      handlePDFError(error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handlePDFError = (error: any) => {
    let errorMessage = 'Failed to generate report. Please try again.';
    
    if (error.code === 'permission-denied') {
      errorMessage = 'You need admin privileges to generate reports';
    } else if (error.message.includes('network')) {
      errorMessage = 'Network error. Please check your internet connection';
    }
    
    Alert.alert('Error', errorMessage);
    console.error('PDF Generation Error:', error);
  };

  const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value }) => (
    <View style={styles.detailItem}>
      <Icon name={icon} size={20} color="#4B5563" />
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  const openInMaps = (address: string) => {
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`);
  };

  if (!authChecked) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Waste Management Report</Text>
        
        {garbagePlaces.length > 0 ? (
          garbagePlaces.map((place) => (
            <View key={place.id} style={styles.card}>
              <Text style={styles.location}>{place.locationName}</Text>
              
              <TouchableOpacity 
                style={styles.address} 
                onPress={() => openInMaps(place.address)}
              >
                <Icon name="place" size={16} color="#3B82F6" />
                <Text style={styles.addressText}>{place.address}</Text>
              </TouchableOpacity>

              <View style={styles.details}>
                <DetailItem icon="storage" label="Capacity" value={`${place.capacity}kg`} />
                <DetailItem icon="person" label="Contact" value={place.contactPerson} />
                <DetailItem icon="phone" label="Phone" value={place.phoneNumber} />
                <DetailItem icon="delete" label="Waste Type" value={place.wasteType} />
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="warning" size={40} color="#94A3B8" />
            <Text style={styles.emptyText}>No data available for report</Text>
          </View>
        )}
      </ScrollView>

      {garbagePlaces.length > 0 && (
        <TouchableOpacity 
          style={styles.pdfButton}
          onPress={generatePDF}
          disabled={generatingPDF}
        >
          {generatingPDF ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Icon name="picture-as-pdf" size={20} color="#FFF" />
              <Text style={styles.pdfButtonText}>Generate PDF</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {generatingPDF && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.generatingText}>Creating Report...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  content: {
    padding: 16,
    paddingBottom: 100
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2
  },
  location: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8
  },
  address: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  addressText: {
    color: '#3B82F6',
    marginLeft: 8
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    minWidth: '48%'
  },
  detailLabel: {
    color: '#6B7280',
    marginLeft: 8,
    marginRight: 4
  },
  detailValue: {
    color: '#1F2937',
    fontWeight: '500'
  },
  pdfButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12
  },
  pdfButtonText: {
    color: '#FFF',
    fontWeight: '600'
  },
  emptyState: {
    alignItems: 'center',
    padding: 40
  },
  emptyText: {
    color: '#64748B',
    marginTop: 16
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  generatingText: {
    marginTop: 16,
    color: '#1F2937'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ReportDetails;