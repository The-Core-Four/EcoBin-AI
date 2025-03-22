import { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';
import { useColorScheme } from '../hooks/useColorScheme';
import { useThemeColor } from '../hooks/useThemeColor';

type ThemedViewProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const ThemedView = ({ children, style, ...props }: ThemedViewProps) => {
  const { colorScheme } = useColorScheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [colorScheme]);

  return (
    <Animated.View
      style={[
        { backgroundColor: useThemeColor('background') },
        { opacity: fadeAnim },
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};