import { useEffect } from 'react';
import { ColorSchemeName, Appearance } from 'react-native';
import { useTheme } from './useThemeColor';

export function useColorScheme(): {
  colorScheme: ColorSchemeName;
  isDark: boolean;
  toggleTheme: () => void;
} {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme || 'light');
    });
    return () => subscription.remove();
  }, [setTheme]);

  return {
    colorScheme: theme,
    isDark: theme === 'dark',
    toggleTheme: () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  };
}