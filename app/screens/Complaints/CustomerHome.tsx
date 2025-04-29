import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, 
  ScrollView, ActivityIndicator, Alert, RefreshControl, ImageBackground
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import CustomerNav from '../../Components/CustomerNav';
import Header from '../../Components/HeaderCustomer';
import userStore from '../../Store/userStore';

// Import images correctly
const hero = require('../../../assets/homeHero.jpg');
const add = require('../../../assets/add.png');
const edit = require('../../../assets/edit.png');
const list = require('../../../assets/list.png');
const bin = require('../../../assets/nav (2).png');

const CustomerHome: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { user } = userStore();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Simulated data loading effect
  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setLastUpdated(new Date().toLocaleTimeString());
      }, 1500);
    }
  }, [isFocused]);

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastUpdated(new Date().toLocaleTimeString());
    }, 1200);
  }, []);

  const handleNavigation = (screen: string) => {
    if (!user) {
      Alert.alert('Session Expired', 'Please login again');
      navigation.navigate('Signinscreen');
      return;
    }
    
    setLoading(true);
    navigation.navigate(screen);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Loading Dashboard...</Text>
        </View>
        <CustomerNav />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.innerContainer}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome back, {user?.name || 'Guest'}!</Text>
            <Text style={styles.statusText}>All systems operational</Text>
          </View>

          {/* Hero Image */}
          <ImageBackground source={hero} style={styles.topImage} resizeMode="cover">
           
          </ImageBackground>

          <View style={styles.gridContainer}>
            {[
              { screen: 'AddComplaint', icon: add, title: 'New Complaint', subtitle: 'Report a new issue' },
              { screen: 'ComplaintList', icon: list, title: 'My Complaints', subtitle: 'View your submissions' },
              { screen: 'UpdateDeleteComplaint', icon: edit, title: 'Manage Complaints', subtitle: 'Edit or remove entries' },
              { screen: 'UserGarbage', icon: bin, title: 'Waste Locations', subtitle: 'Find disposal sites' },
            ].map((item, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.gridItem} 
                onPress={() => handleNavigation(item.screen)}
                activeOpacity={0.9}
              >
                <View style={styles.iconContainer}>
                  <Image source={item.icon} style={styles.buttonImage} />
                </View>
                <Text style={styles.buttonText}>{item.title}</Text>
                <Text style={styles.subText}>{item.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <CustomerNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FCF9',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  welcomeContainer: {
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    color: '#81C784',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#2E7D32',
    fontSize: 16,
  },
  topImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  buttonImage: {
    width: 48,
    height: 48,
    tintColor: '#2E7D32',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B5E20',
    textAlign: 'center',
    marginVertical: 4,
  },
  subText: {
    fontSize: 12,
    color: '#81C784',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default CustomerHome;
