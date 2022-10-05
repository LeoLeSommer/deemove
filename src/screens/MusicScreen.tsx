import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from './HomeScreen';
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

export default function MusicScreen() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Album" component={AlbumScreen} />
        <Stack.Screen name="Artist" component={ArtistScreen} />
        <Stack.Screen name="Playlist" component={PlaylistScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
