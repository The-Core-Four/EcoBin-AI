import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../constants/Colors';

const AdminNav: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState(route.name);

  useEffect(() => {
    const state = navigation.getState();
    if (state) {
      const currentRoute = state.routes[state.index].name;
      setActiveTab(currentRoute);
    }
  }, [navigation, route]);

  const handleNavigation = (routeName: string) => {
    navigation.navigate(routeName);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => handleNavigation('HomeDD')} 
        style={[
          styles.tabContainer,
          activeTab === 'HomeDD' && styles.activeTabContainer
        ]}
      >
        <Icon 
          name="home" 
          size={28} 
          color={activeTab === 'HomeDD' ? Colors.light.DARK_GREEN : Colors.light.NEAR_WHITE} 
        />
        <Text style={[
          styles.label,
          activeTab === 'HomeDD' ? styles.activeLabel : styles.inactiveLabel
        ]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => handleNavigation('MainGarbage')} 
        style={[
          styles.tabContainer,
          activeTab === 'MainGarbage' && styles.activeTabContainer
        ]}
      >
        <Icon 
          name="delete" 
          size={28} 
          color={activeTab === 'MainGarbage' ? Colors.light.DARK_GREEN : Colors.light.NEAR_WHITE} 
        />
        <Text style={[
          styles.label,
          activeTab === 'MainGarbage' ? styles.activeLabel : styles.inactiveLabel
        ]}>
          Garbage
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => handleNavigation('AdminSideComplaint')} 
        style={[
          styles.tabContainer,
          activeTab === 'AdminSideComplaint' && styles.activeTabContainer
        ]}
      >
        <Icon 
          name="list-alt" 
          size={28} 
          color={activeTab === 'AdminSideComplaint' ? Colors.light.DARK_GREEN : Colors.light.NEAR_WHITE} 
        />
        <Text style={[
          styles.label,
          activeTab === 'AdminSideComplaint' ? styles.activeLabel : styles.inactiveLabel
        ]}>
          Complaints
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 65, // Reduced from 85
    backgroundColor: Colors.light.DARK_GREEN,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10, // Reduced from 15
    borderTopWidth: 2, // Reduced from 3
    borderTopColor: Colors.light.FOREST_GREEN,
    elevation: 8, // Reduced from 12
    shadowColor: Colors.light.DARK_ACCENT,
    shadowOffset: { width: 0, height: -3 }, // Reduced from -6
    shadowOpacity: 0.15, // Reduced from 0.2
    shadowRadius: 6, // Reduced from 8
  },
  tabContainer: {
    alignItems: 'center',
    paddingVertical: 8, // Reduced from 12
    paddingHorizontal: 12, // Reduced from 18
    borderRadius: 10, // Slightly smaller
    marginHorizontal: 3, // Reduced from 5
  },
  activeTabContainer: {
    backgroundColor: Colors.light.LIGHT_ACCENT,
    elevation: 4, // Reduced from 6
    shadowColor: Colors.light.DARK_ACCENT,
    shadowOffset: { width: 0, height: 2 }, // Reduced from 3
    shadowOpacity: 0.15, // Reduced from 0.2
    shadowRadius: 4, // Reduced from 6
  },
  label: {
    fontSize: 12, // Reduced from 13
    fontWeight: '600',
    marginTop: 2, // Reduced from 4
  },
  activeLabel: {
    color: Colors.light.DARK_GREEN,
  },
  inactiveLabel: {
    color: Colors.light.NEAR_WHITE,
  },
});

export default AdminNav;