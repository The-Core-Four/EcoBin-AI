import { Dimensions, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Linking } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { TextInput, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Interface for Google Places result
interface PlaceResult {
  place_id: string;
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  formatted_address?: string;
}

const { width, height } = Dimensions.get("window");
const INITIAL_LAT = 7.8731;
const INITIAL_LNG = 80.7718;
const INITIAL_REGION = {
  latitude: INITIAL_LAT,
  longitude: INITIAL_LNG,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

const MapLocator = ({ route }) => {
  const { address } = route.params;
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const map = useRef<MapView>(null);
  const theme = useTheme();

  useEffect(() => {
    if (address) {
      searchPlaces();
    }
  }, [address]);

  const searchPlaces = async () => {
    if (!address?.trim()) {
      setError('Please enter a valid address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json";
      const params = new URLSearchParams({
        query: address,
        location: `${INITIAL_LAT},${INITIAL_LNG}`,
        radius: '2000',
        key: process.env.GOOGLE_MAPS_API_KEY,
      });

      const response = await fetch(`${apiUrl}?${params}`);
      const data = await response.json();

      if (data.status === 'OK') {
        setResults(data.results);
        fitToMarkers(data.results);
      } else {
        setError('No locations found for this address');
      }
    } catch (err) {
      setError('Failed to fetch locations. Please check your connection.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fitToMarkers = (places: PlaceResult[]) => {
    const coordinates = places.map(place => ({
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
    }));

    if (coordinates.length > 0) {
      map.current?.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  const openInGoogleMaps = () => {
    if (!address) {
      setError('No address provided');
      return;
    }

    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url).catch(() => {
      setError('Failed to open Google Maps');
    });
  };

  if (!address) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Address not provided</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={map}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        accessibilityLabel="Map showing garbage locations"
      >
        {results.map((place, i) => (
          <Marker
            key={place.place_id}
            coordinate={{
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            }}
            title={place.name}
            description={place.formatted_address}
          >
            <Icon name="delete" size={24} color={theme.colors.error} />
          </Marker>
        ))}
      </MapView>

      <View style={[styles.controlsContainer, { backgroundColor: theme.colors.background }]}>
        <TextInput
          label="Search Address"
          value={address}
          mode="outlined"
          editable={false}
          right={<TextInput.Icon name="magnify" />}
          style={styles.searchInput}
        />

        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={searchPlaces}
            disabled={loading}
          >
            <Icon name="map-marker" size={20} color="white" />
            <Text style={styles.buttonText}>Show Locations</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.accent }]}
            onPress={openInGoogleMaps}
          >
            <Icon name="google-maps" size={20} color="white" />
            <Text style={styles.buttonText}>Open in Maps</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Searching locations...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorBanner}>
          <Icon name="error-outline" size={20} color="white" />
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  controlsContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    backgroundColor: 'white',
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  errorBanner: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff4444',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  errorMessage: {
    color: 'white',
    flex: 1,
  },
  errorText: {
    fontSize: 18,
    color: '#d9534f',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MapLocator;