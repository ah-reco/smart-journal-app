import React from 'react';
import { ThemeProvider } from '@rneui/themed';
import NewEntryScreen from './src/screens/NewEntryScreen';

export default function App() {
  return (
    <ThemeProvider>
      <NewEntryScreen />
    </ThemeProvider>
  );
}
