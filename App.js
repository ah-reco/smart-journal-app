import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@rneui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { EntryProvider } from './src/context/EntryContext';
import AppNavigator from './src/navigation/AppNavigator';
import { lightTheme } from './src/utils/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={lightTheme}>
        <EntryProvider>
          <AppNavigator />
          <StatusBar style="light" />
        </EntryProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
