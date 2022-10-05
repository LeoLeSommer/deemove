import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'react-native-paper';
import LibraryTracksScreen from './LibraryTracksScreen';
import LibraryArtistsScreen from './LibraryArtistsScreen';
import LibraryAlbumsScreen from './LibraryAlbumsScreen';
import locales from '../locales';

const Tab = createMaterialTopTabNavigator();

export default function LibraryHomeScreen() {
  const theme = useTheme();

  return (
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
        component={LibraryTracksScreen}
        options={{
          tabBarLabel: locales.library.tracks,
          tabBarIcon: ({color}: any) => (
            <MaterialIcons name="music" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Artists"
        component={LibraryArtistsScreen}
        options={{
          tabBarLabel: locales.library.artists,
          tabBarIcon: ({color}: any) => (
            <MaterialIcons name="account-music" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Albums"
        component={LibraryAlbumsScreen}
        options={{
          tabBarLabel: locales.library.albums,
          tabBarIcon: ({color}: any) => (
            <MaterialIcons name="album" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
