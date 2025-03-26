/**
 * Brand Colors (New addition)
 */
const BRAND_COLORS = {
  WHITE: '#ffffff',
  NEAR_WHITE: '#feffff',
  DARK_GREEN: '#124438',
  DEEP_GREEN: '#104236',
  FOREST_GREEN: '#134539',
  LIGHT_ACCENT: '#e8f5e9', // Added complementary light accent
  DARK_ACCENT: '#0a2e22'  // Added complementary dark accent
};

/**
 * Existing color system with brand integration
 */
export const Colors = {
  light: {
    ...BRAND_COLORS,
    text: '#11181C',
    background: BRAND_COLORS.NEAR_WHITE,
    tint: BRAND_COLORS.DEEP_GREEN,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: BRAND_COLORS.DEEP_GREEN,
    surface: BRAND_COLORS.WHITE,
    primary: BRAND_COLORS.FOREST_GREEN,
    secondary: BRAND_COLORS.LIGHT_ACCENT
  },
  dark: {
    ...BRAND_COLORS,
    text: BRAND_COLORS.NEAR_WHITE,
    background: BRAND_COLORS.DARK_GREEN,
    tint: BRAND_COLORS.FOREST_GREEN,
    icon: BRAND_COLORS.NEAR_WHITE,
    tabIconDefault: BRAND_COLORS.NEAR_WHITE,
    tabIconSelected: BRAND_COLORS.WHITE,
    surface: BRAND_COLORS.DEEP_GREEN,
    primary: BRAND_COLORS.FOREST_GREEN,
    secondary: BRAND_COLORS.DARK_ACCENT
  },
};

// Maintain backward compatibility
export const tintColorLight = Colors.light.tint;
export const tintColorDark = Colors.dark.tint;