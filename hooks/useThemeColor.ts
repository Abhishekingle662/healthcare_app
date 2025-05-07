/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useContext } from 'react';
import { Colors } from '@/constants/Colors';
import { ThemeContext } from '@/contexts/ThemeContext';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    // This should ideally not happen if the hook is used within components rendered by CustomThemeProvider
    // Fallback to a default or throw an error, depending on desired behavior.
    // For now, let's log an error and default to light theme if context is missing.
    console.error('useThemeColor must be used within a CustomThemeProvider. Defaulting to light theme.');
    const theme = 'light'; 
    const colorFromProps = props[theme];
    if (colorFromProps) {
      return colorFromProps;
    }
    return Colors[theme][colorName];
  }

  const { effectiveTheme } = themeContext;
  const colorFromProps = props[effectiveTheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[effectiveTheme][colorName];
  }
}
