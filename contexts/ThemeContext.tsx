import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Assuming AsyncStorage for persistence

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = 'user-theme-preference';

export const CustomThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemTheme = useSystemColorScheme() ?? 'light';
  const [theme, setThemeState] = useState<Theme>('system'); // Default to system
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(systemTheme);

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
        if (storedTheme) {
          setThemeState(storedTheme);
        }
      } catch (e: any) { // Explicitly type 'e'
        console.error("Failed to load theme preference.", e);
      }
    };
    loadThemePreference();
  }, []);

  useEffect(() => {
    const currentEffectiveTheme = theme === 'system' ? systemTheme : theme;
    setEffectiveTheme(currentEffectiveTheme);
    AsyncStorage.setItem(THEME_STORAGE_KEY, theme).catch((e: any) => console.error("Failed to save theme preference.", e)); // Explicitly type 'e'
  }, [theme, systemTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
