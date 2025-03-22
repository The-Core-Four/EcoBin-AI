import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useColorScheme } from '../hooks/useColorScheme';
import { useThemeColor } from '../hooks/useThemeColor';
import { lighten, darken } from 'polished';

type ButtonProps = {
  children: string;
  onPress?: () => void;
};

export const Button = ({ children, onPress }: ButtonProps) => {
  const { isDark } = useColorScheme();
  const bgColor = useThemeColor('primary');
  const textColor = isDark ? lighten(0.4, bgColor) : darken(0.4, bgColor);

  return (
    <ThemedView
      style={{
        backgroundColor: bgColor,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
      }}
      onPress={onPress}
    >
      <ThemedText style={{ color: textColor, fontWeight: '600' }}>
        {children}
      </ThemedText>
    </ThemedView>
  );
};