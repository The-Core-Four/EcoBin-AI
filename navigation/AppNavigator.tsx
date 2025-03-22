// navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
  return (
    <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
      {/* Auth Screens */}
      <Stack.Screen name="LogIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />

      {/* Driver Details Screens */}
      <Stack.Screen name="HomeDD" component={HomeDD} />
      <Stack.Screen name="AddDriverDetails" component={AddDriverDetails} />
      <Stack.Screen name="DDList" component={DDList} />
      <Stack.Screen name="UpdateDeleteDD" component={UpdateDeleteDD} />

      {/* Garbage Management Screens */}
      <Stack.Screen name="AddGarbagePlace" component={AddGarbagePlace} />
      <Stack.Screen name="HomeG" component={HomeG} />
      <Stack.Screen name="PlaceView" component={PlaceView} />
      <Stack.Screen name="EditPlace" component={EditPlace} />
      <Stack.Screen name="MapLocator" component={MapLocator} />
      <Stack.Screen name="ReportDetails" component={ReportDetails} />
      <Stack.Screen name="UserGarbage" component={UserGarbage} />
      <Stack.Screen name="UserView" component={UserView} />
      <Stack.Screen name="MainGarbage" component={MainGarbage} />

      {/* Complaint Screens */}
      <Stack.Screen name="AddComplaint" component={AddComplaint} />
      <Stack.Screen name="CustomerHome" component={CustomerHome} />
      <Stack.Screen name="ComplaintList" component={ComplaintList} />
      <Stack.Screen name="UpdateDeleteComplaint" component={UpdateDeleteComplaint} />
      <Stack.Screen name="AdminSideComplaint" component={AdminSideComplaint} />
      <Stack.Screen name="ComplaintReport" component={ComplaintReport} />

      {/* Utility Screens */}
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
      <Stack.Screen name="Chatbot" component={Chatbot} />
      <Stack.Screen name="DisplayScreen" component={DisplayScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;