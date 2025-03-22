import { useEffect, useState } from 'react';
import { useTheme } from './useThemeColor';

export function useColorScheme() {
  const { theme, setTheme } = useTheme();
  const [systemScheme, setSystemScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => 
      setSystemScheme(e.matches ? 'dark' : 'light');

    mediaQuery.addEventListener('change', handler);
    setSystemScheme(mediaQuery.matches ? 'dark' : 'light');

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return {
    colorScheme: theme || systemScheme,
    isDark: (theme || systemScheme) === 'dark',
    toggleTheme: () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  };
}