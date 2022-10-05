import React from 'react';
import {SafeAreaView} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'react-native-paper';
import FavoriteAlbumsScreen from './FavoriteAlbumsScreen';
import FavoriteArtistsScreen from './FavoriteArtistsScreen';
import FavoritePlaylistsScreen from './FavoritePlaylistsScreen';
import FavoriteTracksScreen from './FavoriteTracksScreen';
import locales from '../locales';

const Tab = createMaterialTopTabNavigator();

export default function FavoritesHomeScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={{height: '100%'}}>
      <Tab.Navigator
        sceneContainerStyle={{backgroundColor: theme.colors.background}}
        screenOptions={{
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.primary,
          },
          tabBarStyle: {
            backgroundColor: theme.colors.elevation.level1,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.onBackground,
        }}>
        <Tab.Screen
          name="Tracks"
          component={FavoriteTracksScreen}
          options={{
            tabBarLabel: locales.favorites.tracks,
            tabBarIcon: ({color}: any) => (
              <MaterialIcons name="music" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Artists"
          component={FavoriteArtistsScreen}
          options={{
            tabBarLabel: locales.favorites.artists,
            tabBarIcon: ({color}: any) => (
              <MaterialIcons name="account-music" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Albums"
          component={FavoriteAlbumsScreen}
          options={{
            tabBarLabel: locales.favorites.albums,
            tabBarIcon: ({color}: any) => (
              <MaterialIcons name="album" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Playlist"
          component={FavoritePlaylistsScreen}
          options={{
            tabBarLabel: locales.favorites.playlists,
            tabBarIcon: ({color}: any) => (
              <MaterialIcons name="playlist-music" color={color} size={24} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
