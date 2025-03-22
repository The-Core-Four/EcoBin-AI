import { Text, StyleProp, TextStyle } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

type ThemedTextProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  variant?: 'body' | 'title' | 'subtitle';
};

export const ThemedText = ({ children, style, variant = 'body' }: ThemedTextProps) => {
  const textColor = useThemeColor('text');
  
  const variantStyles = {
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 8,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '600',
      marginVertical: 4,
    },
    body: {
      fontSize: 14,
    }
  };

  return (
    <Text style={[{ color: textColor }, variantStyles[variant], style]}>
      {children}
    </Text>
  );
};