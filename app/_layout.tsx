import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useContext } from 'react';

import { CustomThemeProvider, ThemeContext } from '@/contexts/ThemeContext'; // Import CustomThemeProvider and ThemeContext

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <CustomThemeProvider>
      <MainLayout />
    </CustomThemeProvider>
  );
}

function MainLayout() {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    // This should not happen as MainLayout is always rendered within CustomThemeProvider
    return null;
  }

  const { effectiveTheme } = themeContext;

  return (
    <ThemeProvider value={effectiveTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={effectiveTheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
