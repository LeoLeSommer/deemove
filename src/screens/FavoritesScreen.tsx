import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import FavoritesHomeScreen from './FavoritesHomeScreen';
import AlbumScreen from './AlbumScreen';
import ArtistScreen from './ArtistScreen';
import PlaylistScreen from './PlaylistScreen';

const Stack = createNativeStackNavigator();

export type MusicParamList = {
  Album: {
    id: string;
  };
  Artist: {
    id: string;
  };
  Playlist: {
    id: string;
  };
};

export default function FavoritesScreen() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={FavoritesHomeScreen} />
        <Stack.Screen name="Album" component={AlbumScreen} />
        <Stack.Screen name="Artist" component={ArtistScreen} />
        <Stack.Screen name="Playlist" component={PlaylistScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
