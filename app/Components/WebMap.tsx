import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WebMap = ({ style }: { style?: object }) => {
  return (
    <View style={[styles.container, style]}>
      <Text>Map component - Web implementation required</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    minHeight: 200,
  },
});

export default WebMap;