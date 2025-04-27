declare module 'react-native-maps' {
    import { Component } from 'react';
    import { ViewProps } from 'react-native';
  
    export interface MapViewProps extends ViewProps {
      initialRegion?: {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
      };
    }
  
    export class MapView extends Component<MapViewProps> {}
    export const Marker: React.ComponentType<any>;
    export const Polyline: React.ComponentType<any>;
    export default MapView;
  }