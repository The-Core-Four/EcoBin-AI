import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../Firebase_Config';
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import userStore from '../Store/userStore';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HeaderCustomer: React.FC = () => {
  const user = FIREBASE_AUTH.currentUser;
  const navigation = useNavigation();
  const { user: storedUser, setUser, clearUser } = userStore();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const refDoc = doc(FIREBASE_DB, 'users', user.uid);
          const userDoc = await getDoc(refDoc);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              name: userData.name || 'Customer',
              email: user.email || '',
              uid: user.uid
            });
          }
        } catch (error) {
          console.error('Error fetching user details: ', error);
          Alert.alert('Error', 'Failed to load profile data');
        }
      }
    };
    fetchUserData();
  }, [user, setUser]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const confirmLogout = () => {
    Alert.alert(
      'Confirm Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await FIREBASE_AUTH.signOut();
              clearUser();
              navigation.dispatch(StackActions.replace('Signinscreen'));
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView edges={['top']}>
      <StatusBar backgroundColor="#166534" barStyle="light-content" />
      <View style={styles.headerContainer}>
        <View style={styles.userInfo}>
          <Icon 
            name="person" 
            size={28} 
            color="#fff" 
            style={styles.userIcon} 
          />
          <View style={styles.textContainer}>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
            <Text style={styles.userName}>
              {storedUser?.name || 'Guest User'}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={confirmLogout}
          activeOpacity={0.8}
        >
          <Icon name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#166534',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textContainer: {
    marginLeft: 8,
  },
  userIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 6,
  },
  greetingText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
  },
  userName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  logoutText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
});

export default HeaderCustomer;