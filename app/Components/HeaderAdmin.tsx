import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../Firebase_Config';
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import userStore from '../Store/userStore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationProps } from '../../types/navigation'; // Import your navigation types

const HeaderAdmin: React.FC = () => {
  const user = FIREBASE_AUTH.currentUser;
  const navigation = useNavigation<NavigationProps>();
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
              name: userData.name || '',
              email: user.email || '',
              uid: user.uid
            });
          }
        } catch (error) {
          console.error('Error fetching user details: ', error);
          Alert.alert('Error', 'Failed to load user data');
        }
      }
    };
    fetchUserData();
  }, [user, setUser]); // Added setUser to dependencies

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await FIREBASE_AUTH.signOut();
              clearUser();
              navigation.dispatch(StackActions.replace('LogIn')); // Use correct screen name
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to log out');
            }
          }
        }
      ]
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView edges={['top']}>
      <StatusBar backgroundColor="#166534" barStyle="light-content" />
      <View style={styles.headerContainer}>
        <View style={styles.userInfo}>
          <Icon name="account-circle" size={28} color="#fff" />
          <View>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
            <Text style={styles.adminText}>
              {storedUser?.name || 'Administrator'}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Icon name="logout" size={18} color="#fff" />
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
  greetingText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  adminText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  logoutText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
});

export default HeaderAdmin;