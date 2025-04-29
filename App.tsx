import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Driver Details Screens
import HomeDD from './app/screens/DriverDetails/HomeDD';
import AddDriverDetails from './app/screens/DriverDetails/AddDriverDetails';
import DDList from './app/screens/DriverDetails/DDList';
import UpdateDeleteDD from './app/screens/DriverDetails/UpdateDeleteDD';

// Auth Screens
import SignUpScreen from './app/screens/SignUp';
import Signinscreen from './app/screens/LogIn';
import LogIn from './app/screens/LogIn';

// Utility Screens
import CameradScreen from './app/screens/CameradScreen';
import Chatbot from './app/screens/Chatbot';
import DisplayScreen from './app/screens/DisplayScreen';

// Garbage Management Screens
import AddGarbagePlace from './app/screens/GarbagePlaces/AddGarbagePlace';
import HomeG from './app/screens/GarbagePlaces/HomeG';
import PlaceView from './app/screens/GarbagePlaces/PlaceView';
import EditPlace from './app/screens/GarbagePlaces/EditPlace';
import MapLocator from './app/screens/GarbagePlaces/MapLocator';
import ReportDetails from './app/screens/GarbagePlaces/ReportDetails';
import UserGarbage from './app/screens/GarbagePlaces/UserGarbage';
import UserView from './app/screens/GarbagePlaces/UserView';
import MainGarbage from './app/screens/GarbagePlaces/MainGarbage';

// Complaints Management
import AddComplaint from './app/screens/Complaints/AddComplaint';
import CustomerHome from './app/screens/Complaints/CustomerHome';
import ComplaintList from './app/screens/Complaints/ComplaintList';
import UpdateDeleteComplaint from './app/screens/Complaints/UpdateDeleteComplaint';
import AdminSideComplaint from './app/screens/Complaints/AdminSideComplaint';
import ComplaintReport from './app/screens/Complaints/ComplaintReport';

const Stack = createNativeStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator 
      initialRouteName="Signinscreen"
      screenOptions={{ headerShown: false }}
    >
      {/* Authentication Flow */}
      <Stack.Screen name="Signinscreen" component={Signinscreen} />
      <Stack.Screen name="LogIn" component={LogIn} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />

      {/* Driver Details Flow */}
      <Stack.Screen name="HomeDD" component={HomeDD} />
      <Stack.Screen name="AddDriverDetails" component={AddDriverDetails} />
      <Stack.Screen name="DDList" component={DDList} />
      <Stack.Screen name="UpdateDeleteDD" component={UpdateDeleteDD} />

      {/* Garbage Management Flow */}
      <Stack.Screen name="MainGarbage" component={MainGarbage} />
      <Stack.Screen name="HomeG" component={HomeG} />
      <Stack.Screen name="AddGarbagePlace" component={AddGarbagePlace} />
      <Stack.Screen name="PlaceView" component={PlaceView} />
      <Stack.Screen name="EditPlace" component={EditPlace} />
      <Stack.Screen name="MapLocator" component={MapLocator} />
      <Stack.Screen name="ReportDetails" component={ReportDetails} />
      <Stack.Screen name="UserGarbage" component={UserGarbage} />
      <Stack.Screen name="UserView" component={UserView} />

      {/* Complaints Management */}
      <Stack.Screen name="CustomerHome" component={CustomerHome} />
      <Stack.Screen name="AddComplaint" component={AddComplaint} />
      <Stack.Screen name="ComplaintList" component={ComplaintList} />
      <Stack.Screen name="UpdateDeleteComplaint" component={UpdateDeleteComplaint} />
      <Stack.Screen name="AdminSideComplaint" component={AdminSideComplaint} />
      <Stack.Screen name="ComplaintReport" component={ComplaintReport} />

      {/* Utility Screens */}
      <Stack.Screen name="CameradScreen" component={CameradScreen} />
      <Stack.Screen name="Chatbot" component={Chatbot} />
      <Stack.Screen name="DisplayScreen" component={DisplayScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;