// types/theme.types.ts
export type ColorSchemeName = 'light' | 'dark';

export type ThemeColors = {
  background: string;
  primary: string;
  text: string;
};

export type ThemePalette = {
  light: ThemeColors;
  dark: ThemeColors;
};