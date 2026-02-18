/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#E91E63'; // Primary Ecommerce Color
const tintColorDark = '#FF4081';

export const Colors = {
  light: {
    text: '#11181C',
    subtext: '#666666',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorLight,
    card: '#F8F9FA',
    border: '#EEEEEE',
    primary: tintColorLight,
    secondary: '#FF80AB',
    success: '#4CAF50',
    error: '#F44336',
    skeleton: '#E1E9EE',
    divider: 'rgba(0,0,0,0.05)',
  },
  dark: {
    text: '#ECEDEE',
    subtext: '#999999',
    background: '#121212',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    card: '#1E1E1E',
    border: '#333333',
    primary: tintColorDark,
    secondary: '#FF4081',
    success: '#81C784',
    error: '#E57373',
    skeleton: '#2A2A2A',
    divider: 'rgba(255,255,255,0.1)',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
