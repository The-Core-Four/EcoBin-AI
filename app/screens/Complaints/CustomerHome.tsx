import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomerNav from '../../Components/CustomerNav';
import Header from '../../Components/HeaderCustomer';

const hero = require('../../../assets/homeHero.jpg');
const add = require('../../../assets/add.png');
const edit = require('../../../assets/edit.png');
const list = require('../../../assets/list.png');
const bin = require('../../../assets/nav (2).png');

const CustomerHome: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <Image source={hero} style={styles.topImage} />
          
          <View style={styles.gridContainer}>
            <TouchableOpacity 
              style={styles.gridItem} 
              onPress={() => navigation.navigate('AddComplaint')}
              activeOpacity={0.9}
            >
              <View style={styles.iconContainer}>
                <Image source={add} style={styles.buttonImage} />
              </View>
              <Text style={styles.buttonText}>New Complaint</Text>
              <Text style={styles.subText}>Report a new issue</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.gridItem} 
              onPress={() => navigation.navigate('ComplaintList')}
              activeOpacity={0.9}
            >
              <View style={styles.iconContainer}>
                <Image source={list} style={styles.buttonImage} />
              </View>
              <Text style={styles.buttonText}>My Complaints</Text>
              <Text style={styles.subText}>View your submissions</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.gridItem} 
              onPress={() => navigation.navigate('UpdateDeleteComplaint')}
              activeOpacity={0.9}
            >
              <View style={styles.iconContainer}>
                <Image source={edit} style={styles.buttonImage} />
              </View>
              <Text style={styles.buttonText}>Manage Complaints</Text>
              <Text style={styles.subText}>Edit or remove entries</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.gridItem} 
              onPress={() => navigation.navigate('UserGarbage')}
              activeOpacity={0.9}
            >
              <View style={styles.iconContainer}>
                <Image source={bin} style={styles.buttonImage} />
              </View>
              <Text style={styles.buttonText}>Waste Locations</Text>
              <Text style={styles.subText}>Find disposal sites</Text>
            </TouchableOpacity>
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
  topImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginVertical: 16,
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