import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EntriesScreen from '../screens/EntriesScreen';
import CreateEntryScreen from '../screens/CreateEntryScreen';
import EntryDetailScreen from '../screens/EntryDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#fff' },
        }}
      >
        <Stack.Screen
          name="Entries"
          component={EntriesScreen}
          options={{ title: 'My Journal' }}
        />
        <Stack.Screen
          name="CreateEntry"
          component={CreateEntryScreen}
          options={{
            title: 'New Entry',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="EntryDetail"
          component={EntryDetailScreen}
          options={{ title: 'Entry Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
