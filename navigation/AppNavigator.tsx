// navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useAppTheme } from '../app/context/ThemeContext';
import { useThemeColor } from '../app/hooks/useThemeColor'; 
import { ThemedText } from '../app/Components/ThemedText'; 
import { ThemedView } from '../app/Components/ThemedView'; 
import { ColorSchemeName } from '../types/theme.types';

import HomeDD from '../app/screens/DriverDetails/HomeDD';
import AddDriverDetails from '../app/screens/DriverDetails/AddDriverDetails';
import DDList from '../app/screens/DriverDetails/DDList';
import SignUpScreen from '../app/screens/SignUp';
import SignInScreen from '../app/screens/LogIn';
import UpdateDeleteDD from '../app/screens/DriverDetails/UpdateDeleteDD';
import CameraScreen from '../app/screens/CameradScreen';
import Chatbot from '../app/screens/Chatbot';
import AddGarbagePlace from '../app/screens/GarbagePlaces/AddGarbagePlace';
import HomeG from '../app/screens/GarbagePlaces/HomeG';
import PlaceView from '../app/screens/GarbagePlaces/PlaceView';
import EditPlace from '../app/screens/GarbagePlaces/EditPlace';
import MapLocator from '../app/screens/GarbagePlaces/MapLocator';
import ReportDetails from '../app/screens/GarbagePlaces/ReportDetails';
import UserGarbage from '../app/screens/GarbagePlaces/UserGarbage';
import UserView from '../app/screens/GarbagePlaces/UserView';
import MainGarbage from '../app/screens/GarbagePlaces/MainGarbage';
import AddComplaint from '../app/screens/Complaints/AddComplaint';
import CustomerHome from '../app/screens/Complaints/CustomerHome';
import ComplaintList from '../app/screens/Complaints/ComplaintList';
import UpdateDeleteComplaint from '../app/screens/Complaints/UpdateDeleteComplaint';
import AdminSideComplaint from '../app/screens/Complaints/AdminSideComplaint';
import ComplaintReport from '../app/screens/Complaints/ComplaintReport';
import DisplayScreen from '../app/screens/DisplayScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { theme } = useAppTheme(); // Get theme from context
  
  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const headerTint = useThemeColor('primary');

  // Type-safe screen options
  const screenOptions: NativeStackNavigationOptions = {
    headerShown: true,
    headerStyle: {
      backgroundColor: backgroundColor,
    },
    headerTintColor: headerTint,
    headerTitleStyle: {
      color: textColor,
    },
    headerTitle: ({ children }) => (
      <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>
        {children}
      </ThemedText>
    ),
    headerBackground: () => <ThemedView style={{ flex: 1 }} children={undefined} />,
  };

  return (
    <Stack.Navigator 
      initialRouteName="SignIn" 
      screenOptions={screenOptions}
    >
      {/* Authentication Flow */}
      <Stack.Group>
        <Stack.Screen 
          name="LogIn" 
          component={SignInScreen} 
          options={{ title: 'User Login' }}
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen} 
          options={{ title: 'Create Account' }}
        />
      </Stack.Group>

      {/* Driver Management Flow */}
      <Stack.Group screenOptions={{ headerBackTitleVisible: false }}>
        <Stack.Screen 
          name="HomeDD" 
          component={HomeDD} 
          options={{ title: 'Driver Management' }}
        />
        <Stack.Screen 
          name="AddDriverDetails" 
          component={AddDriverDetails} 
          options={{ title: 'Add New Driver' }}
        />
        <Stack.Screen 
          name="DDList" 
          component={DDList} 
          options={{ title: 'Driver List' }}
        />
        <Stack.Screen 
          name="UpdateDeleteDD" 
          component={UpdateDeleteDD} 
          options={{ title: 'Edit Driver' }}
        />
      </Stack.Group>

      {/* Garbage Management Flow */}
      <Stack.Group screenOptions={{ animation: 'slide_from_right' }}>
        <Stack.Screen 
          name="AddGarbagePlace" 
          component={AddGarbagePlace} 
          options={{ title: 'Add Location' }}
        />
        <Stack.Screen 
          name="HomeG" 
          component={HomeG} 
          options={{ title: 'Garbage Locations' }}
        />
        <Stack.Screen 
          name="PlaceView" 
          component={PlaceView} 
          options={{ title: 'Location Details' }}
        />
        <Stack.Screen 
          name="EditPlace" 
          component={EditPlace} 
          options={{ title: 'Edit Location' }}
        />
        <Stack.Screen 
          name="MapLocator" 
          component={MapLocator} 
          options={{ title: 'Map View' }}
        />
        <Stack.Screen 
          name="ReportDetails" 
          component={ReportDetails} 
          options={{ title: 'Report Details' }}
        />
        <Stack.Screen 
          name="UserGarbage" 
          component={UserGarbage} 
          options={{ title: 'My Reports' }}
        />
        <Stack.Screen 
          name="UserView" 
          component={UserView} 
          options={{ title: 'User View' }}
        />
        <Stack.Screen 
          name="MainGarbage" 
          component={MainGarbage} 
          options={{ title: 'Garbage Dashboard' }}
        />
      </Stack.Group>

      {/* Complaint Management Flow */}
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen 
          name="AddComplaint" 
          component={AddComplaint} 
          options={{ title: 'New Complaint' }}
        />
        <Stack.Screen 
          name="CustomerHome" 
          component={CustomerHome} 
          options={{ title: 'Complaints Home' }}
        />
        <Stack.Screen 
          name="ComplaintList" 
          component={ComplaintList} 
          options={{ title: 'All Complaints' }}
        />
        <Stack.Screen 
          name="UpdateDeleteComplaint" 
          component={UpdateDeleteComplaint} 
          options={{ title: 'Edit Complaint' }}
        />
        <Stack.Screen 
          name="AdminSideComplaint" 
          component={AdminSideComplaint} 
          options={{ title: 'Admin View' }}
        />
        <Stack.Screen 
          name="ComplaintReport" 
          component={ComplaintReport} 
          options={{ title: 'Complaint Report' }}
        />
      </Stack.Group>

      {/* Utility Screens */}
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="CameraScreen" 
          component={CameraScreen} 
        />
        <Stack.Screen 
          name="Chatbot" 
          component={Chatbot} 
          options={{ title: 'Support Chat' }}
        />
        <Stack.Screen 
          name="DisplayScreen" 
          component={DisplayScreen} 
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default AppNavigator;