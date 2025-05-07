import { Image } from 'expo-image';
import { Platform, StyleSheet, Button, View, Switch } from 'react-native';
import { useContext } from 'react';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemeContext } from '@/contexts/ThemeContext';

export default function TabTwoScreen() {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    return null;
  }

  const { theme, effectiveTheme, setTheme } = themeContext;

  // Fixed toggle function - use direct mode setting instead of cycling
  const toggleSwitch = () => {
    // Toggle between light and dark mode only
    setTheme(isSwitchEnabled ? 'light' : 'dark');
  };

  // Added separate function for the button that cycles through all options
  const cycleTheme = () => {
    if (theme === 'system') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('system');
    }
  };

  let switchText = 'System Theme';
  // For the switch, treat system theme as off (light)
  // This ensures more predictable toggle behavior
  let isSwitchEnabled = theme === 'dark';

  if (theme === 'light') {
    switchText = 'Light Mode';
    isSwitchEnabled = false;
  } else if (theme === 'dark') {
    switchText = 'Dark Mode';
    isSwitchEnabled = true;
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color={effectiveTheme === 'light' ? '#808080' : '#A0A0A0'}
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      <ThemedView style={styles.settingsContainer}>
        <ThemedText>Dark Mode</ThemedText>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isSwitchEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isSwitchEnabled}
        />
      </ThemedView>
      
      <ThemedView style={styles.buttonContainer}>
        <ThemedText>Theme Preference: {switchText}</ThemedText>
        <Button 
          title={`Cycle Theme (${theme})`}
          onPress={cycleTheme} 
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  settingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 8,
    paddingVertical: 8,
  }
});
