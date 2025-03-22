import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { ColorSchemeName, ThemeColors } from '../../types/theme.types';

const DEFAULT_COLORS = {
  light: {
    background: '#FFFFFF',
    primary: '#007AFF',
    text: '#1C1C1E',
    card: '#F2F2F7',
    border: '#D1D1D6'
  },
  dark: {
    background: '#000000',
    primary: '#0A84FF',
    text: '#FFFFFF',
    card: '#1C1C1E',
    border: '#2C2C2E'
  }
};

export const useTheme = () => {
  const [theme, setTheme] = useState<ColorSchemeName>(() => 
    Appearance.getColorScheme() || 'light'
  );
  const [hasUserSetTheme, setHasUserSetTheme] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('userTheme');
        if (savedTheme) {
          setTheme(savedTheme as ColorSchemeName);
          setHasUserSetTheme(true);
        } else {
          const systemTheme = Appearance.getColorScheme() || 'light';
          setTheme(systemTheme);
          setHasUserSetTheme(false);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  const persistTheme = async (newTheme: ColorSchemeName) => {
    try {
      await AsyncStorage.setItem('userTheme', newTheme);
      setTheme(newTheme);
      setHasUserSetTheme(true);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return { 
    theme, 
    setTheme: persistTheme,
    isSystemTheme: !hasUserSetTheme
  };
};

export const useThemeColor = (colorName: keyof ThemeColors) => {
  const { theme } = useTheme();
  return DEFAULT_COLORS[theme][colorName];
};