import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Alert, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../Firebase_Config';
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import userStore from '../Store/userStore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../constants/Colors';

const HeaderCustomer: React.FC = () => {
  const user = FIREBASE_AUTH.currentUser;
  const navigation = useNavigation();
  const { user: storedUser, setUser, clearUser } = userStore();
  const insets = useSafeAreaInsets();

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
    <View style={styles.fullWidthContainer}>
      <StatusBar 
        backgroundColor={Colors.light.DEEP_GREEN}
        barStyle="light-content" 
        translucent={true}
      />
      <SafeAreaView edges={[]} style={styles.safeArea}>
        <View style={[styles.headerContainer, {
          paddingTop: Platform.OS === 'ios' ? insets.top : 0,
          paddingBottom: 12
        }]}>
          <View style={styles.userInfo}>
            <Icon 
              name="person" 
              size={28} 
              color={Colors.light.WHITE}
              style={styles.userIcon} 
            />
            <View style={styles.textContainer}>
              <Text 
                style={styles.greetingText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {getGreeting()}
              </Text>
              <Text 
                style={styles.userName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {storedUser?.name || 'Guest User'}
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={confirmLogout}
            activeOpacity={0.7}
            accessibilityLabel="Sign out"
          >
            <Icon name="logout" size={20} color={Colors.light.DARK_ACCENT} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullWidthContainer: {
    backgroundColor: Colors.light.DARK_GREEN,
    width: '100%',
    zIndex: 1000,
  },
  safeArea: {
    backgroundColor: Colors.light.DARK_GREEN,
  },
  headerContainer: {
    backgroundColor: Colors.light.DARK_GREEN,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: Platform.OS === 'ios' ? 44 : 56,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(0,0,0,0.1)',
      },
    }),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  textContainer: {
    marginLeft: 12,
    flexShrink: 1,
  },
  userIcon: {
    backgroundColor: Colors.light.LIGHT_ACCENT,
    borderRadius: 20,
    padding: 6,
  },
  greetingText: {
    fontSize: 12,
    color: Colors.light.NEAR_WHITE,
    fontWeight: '400',
  },
  userName: {
    fontSize: 16,
    color: Colors.light.WHITE,
    fontWeight: '600',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.light.LIGHT_ACCENT,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    minHeight: 40,
  },
  logoutText: {
    fontSize: 14,
    color: Colors.light.DARK_ACCENT,
    fontWeight: '500',
  },
});

export default HeaderCustomer;