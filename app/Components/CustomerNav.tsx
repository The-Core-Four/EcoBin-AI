import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../constants/Colors';


const homeicon = require('../../assets/CusHome.png');
const guideicon = require('../../assets/ChatbotIcon.png');
const cameraicon = require('../../assets/CameraIcon.png');

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
        onPress={() => handleNavigation('CustomerHome')} 
        style={[
          styles.tabContainer,
          activeTab === 'CustomerHome' && styles.activeTabContainer
        ]}
      >
        <Icon 
          name="home" 
          size={24} 
          color={activeTab === 'CustomerHome' ? Colors.light.DARK_GREEN : Colors.light.NEAR_WHITE} 
        />
        <Text style={[
          styles.label,
          activeTab === 'CustomerHome' ? styles.activeLabel : styles.inactiveLabel
        ]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => handleNavigation('Chatbot')} 
        style={[
          styles.tabContainer,
          activeTab === 'Chatbot' && styles.activeTabContainer
        ]}
      >
        <Icon 
          name="chat" 
          size={24} 
          color={activeTab === 'Chatbot' ? Colors.light.DARK_GREEN : Colors.light.NEAR_WHITE} 
        />
        <Text style={[
          styles.label,
          activeTab === 'Chatbot' ? styles.activeLabel : styles.inactiveLabel
        ]}>
          Chatbot
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => handleNavigation('CameradScreen')} 
        style={[
          styles.tabContainer,
          activeTab === 'CameradScreen' && styles.activeTabContainer
        ]}
      >
        <Icon 
          name="camera-alt" 
          size={24} 
          color={activeTab === 'CameradScreen' ? Colors.light.DARK_GREEN : Colors.light.NEAR_WHITE} 
        />
        <Text style={[
          styles.label,
          activeTab === 'CameradScreen' ? styles.activeLabel : styles.inactiveLabel
        ]}>
          Camera
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 65,
    backgroundColor: Colors.light.DARK_GREEN,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderTopWidth: 2,
    borderTopColor: Colors.light.FOREST_GREEN,
    elevation: 8,
    shadowColor: Colors.light.DARK_ACCENT,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  tabContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginHorizontal: 3,
  },
  activeTabContainer: {
    backgroundColor: Colors.light.LIGHT_ACCENT,
    elevation: 4,
    shadowColor: Colors.light.DARK_ACCENT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  activeLabel: {
    color: Colors.light.DARK_GREEN,
  },
  inactiveLabel: {
    color: Colors.light.NEAR_WHITE,
  },
});

export default CustomerNav;