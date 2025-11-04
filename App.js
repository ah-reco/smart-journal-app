import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { JournalProvider } from './src/context/JournalContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <JournalProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </JournalProvider>
  );
}
