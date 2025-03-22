import { useEffect } from 'react';
import { ColorSchemeName, Appearance } from 'react-native';
import { useTheme } from './useThemeColor';

export function useColorScheme() {
  const { theme, setTheme } = useTheme();

  // System theme listener
  useEffect(() => {
    const systemTheme = Appearance.getColorScheme();
    if (!theme) setTheme(systemTheme || 'light');

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme || 'light');
    });

    return () => subscription.remove();
  }, []);

  return {
    colorScheme: theme,
    isDark: theme === 'dark',
    toggleTheme: () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  };
}