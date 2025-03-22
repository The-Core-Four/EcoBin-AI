import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../Firebase_Config';
import { doc, getDoc } from "firebase/firestore";
import { useNavigation, StackActions } from '@react-navigation/native';
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
              name: userData.name,
              email: user.email,
              uid: ''
            });
          }
        } catch (error) {
          console.error('Error fetching user details: ', error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const logout = () => {
    FIREBASE_AUTH.signOut()
      .then(() => {
        clearUser();
        navigation.dispatch(StackActions.replace('Signinscreen'));
      })
      .catch((error) => {
        console.error('Error during sign out: ', error);
      });
  };

  return (
    <SafeAreaView edges={['top']}>
      <StatusBar backgroundColor="#166534" barStyle="light-content" />
      <View style={styles.headerContainer}>
        <View style={styles.userInfo}>
          <Icon name="person" size={24} color="#fff" style={styles.userIcon} />
          <Text style={styles.greetingText}>
            Hello, {storedUser?.name || 'Guest'}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={logout}
          activeOpacity={0.8}
        >
          <Icon name="exit-to-app" size={18} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 4,
  },
  greetingText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    letterSpacing: 0.2,
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

export default HeaderCustomer;