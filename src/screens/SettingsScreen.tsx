import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import SettingsBaseScreen from './SettingsBaseScreen';
import DownloadQueueScreen from './DownloadQueueScreen';

const Stack = createNativeStackNavigator();

export type SettingsParamList = {
  DownloadQueue: undefined;
};

export default function SettingsScreen() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Settings" component={SettingsBaseScreen} />
        <Stack.Screen name="DownloadQueue" component={DownloadQueueScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
