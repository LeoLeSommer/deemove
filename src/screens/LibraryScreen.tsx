import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import LibraryHomeScreen from './LibraryHomeScreen';
import LibraryAlbumScreen from './LibraryAlbumScreen';
import LibraryArtistScreen from './LibraryArtistScreen';

const Stack = createNativeStackNavigator();

export type LibraryParamList = {
  Album: {
    id: string;
  };
  Artist: {
    id: string;
  };
};

export default function LibraryScreen() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={LibraryHomeScreen} />
        <Stack.Screen name="Album" component={LibraryAlbumScreen} />
        <Stack.Screen name="Artist" component={LibraryArtistScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
