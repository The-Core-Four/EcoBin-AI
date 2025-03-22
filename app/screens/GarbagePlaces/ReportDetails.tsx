import React from 'react';
import { ScrollView, StyleSheet, Text, View, SafeAreaView, Alert, TouchableOpacity, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import Header from '../../Components/HeaderAdmin';

const ReportDetails = () => {
  const route = useRoute();
  const { garbagePlaces = [] } = route.params || { garbagePlaces: [] };

  const generatePDF = async () => {
    const htmlContent = `
      <html>
        <body>
          <h1>Garbage Places Report</h1>
          ${garbagePlaces.map(
            (place) =>
              `<div>
                <h2>Location Name: ${place.locationName}</h2>
                <p>Address: ${place.address}</p>
                <p>Capacity: ${place.capacity}</p>
                <p>Contact Person: ${place.contactPerson}</p>
                <p>Phone Number: ${place.phoneNumber}</p>
                <p>Waste Type: ${place.wasteType}</p>
              </div>`
          ).join('')}
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF');
      console.error(error);
    }
  };

  const openInMaps = (address: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Failed to open Google Maps');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Text style={styles.title}>Garbage Places Report</Text>
      <ScrollView contentContainerStyle={styles.reportContent}>
        {garbagePlaces.length > 0 ? (
          garbagePlaces.map((place) => (
            <View key={place.id} style={styles.card}>
              <Text style={styles.cardTitle}>{place.locationName}</Text>
              <TouchableOpacity onPress={() => openInMaps(place.address)}>
                <Text style={styles.linkText}>{place.address}</Text>
              </TouchableOpacity>
              <Text style={styles.cardText}>Capacity: {place.capacity}</Text>
              <Text style={styles.cardText}>Contact: {place.contactPerson}</Text>
              <Text style={styles.cardText}>Phone: {place.phoneNumber}</Text>
              <Text style={styles.cardText}>Waste Type: {place.wasteType}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No garbage places found.</Text>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.downloadButton} onPress={generatePDF}>
        <Text style={styles.downloadButtonText}>Download PDF</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ReportDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#111827',
  },
  reportContent: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 3,
  },
  linkText: {
    color: '#2563EB',
    textDecorationLine: 'underline',
    marginBottom: 3,
    fontSize: 14,
  },
  downloadButton: {
    width: '50%',
    height: 50,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  downloadButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 20,
    fontSize: 16,
  },
});
