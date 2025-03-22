// types/navigation.ts
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define all navigation parameters
export type RootStackParamList = {
  // Auth Screens
  LogIn: undefined;
  SignUp: undefined;

  // Driver Details Screens
  HomeDD: undefined;
  AddDriverDetails: undefined;
  DDList: undefined;
  UpdateDeleteDD: { driverId: string };

  // Garbage Management Screens
  AddGarbagePlace: undefined;
  HomeG: undefined;
  PlaceView: { placeId: string };
  EditPlace: { placeId: string };
  MapLocator: undefined;
  ReportDetails: { reportId: string };
  UserGarbage: undefined;
  UserView: { userId: string };
  MainGarbage: undefined;

  // Complaint Screens
  AddComplaint: undefined;
  CustomerHome: undefined;
  ComplaintList: undefined;
  UpdateDeleteComplaint: { complaintId: string };
  AdminSideComplaint: undefined;
  ComplaintReport: { reportId: string };

  // Utility Screens
  CameraScreen: undefined;
  Chatbot: undefined;
  DisplayScreen: undefined;
};

// Navigation prop type
export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

// Extend React Navigation types
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// Optional: Custom hook type
export type UseNavigationType = () => NavigationProps;

// Optional: Route prop type
export type RouteProps<T extends keyof RootStackParamList> = {
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
  route: {
    params: RootStackParamList[T];
  };
};

// Optional: Export for easy imports
export const useAppNavigation = () => useNavigation<NavigationProps>();