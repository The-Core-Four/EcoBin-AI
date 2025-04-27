import { Platform, StyleSheet } from 'react-native';
import WebMap from './WebMap';
import React from 'react';

type MapProps = {
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  style?: object;
  children?: React.ReactNode;
};

const Map = ({ children, style, ...props }: MapProps) => {
  if (Platform.OS === 'web') {
    return <WebMap style={style} {...props} />;
  }

  const ReactNativeMaps = require('react-native-maps').default;
  return (
    <ReactNativeMaps
      style={[styles.container, style]}
      {...props}
    >
      {children}
    </ReactNativeMaps>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Map;