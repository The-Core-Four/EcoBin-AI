// app/hooks/useThemeColor.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorSchemeName, ThemeColors } from '../../types/theme.types';

const DEFAULT_COLORS = {
  light: {
    background: '#FFFFFF',
    primary: '#007AFF',
    text: '#1C1C1E'
  },
  dark: {
    background: '#000000',
    primary: '#0A84FF',
    text: '#FFFFFF'
  }
};

export const useTheme = () => {
  const [theme, setTheme] = useState<ColorSchemeName>('light');

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('userTheme');
      if (savedTheme) setTheme(savedTheme as ColorSchemeName);
    };
    loadTheme();
  }, []);

  const persistTheme = async (newTheme: ColorSchemeName) => {
    await AsyncStorage.setItem('userTheme', newTheme);
    setTheme(newTheme);
  };

  return { theme, setTheme: persistTheme };
};

export const useThemeColor = (colorName: keyof ThemeColors) => {
  const { theme } = useTheme();
  return DEFAULT_COLORS[theme][colorName];
};