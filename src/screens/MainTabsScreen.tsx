import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {BottomNavigation} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MusicScreen from './MusicScreen';
import FavoritesScreen from './FavoritesScreen';
import LibraryScreen from './LibraryScreen';
import SettingsScreen from './SettingsScreen';
import BottomMusicPlayer from '../components/molecules/BottomMusicPlayer';
import MusicPlayerScreen from './MusicPlayerScreen';
import useMusicPlayer from '../hooks/musicPlayer';
import locales from '../locales';
import useUser from '../hooks/user';

export default function MainTabsScreen() {
  const [index, setIndex] = React.useState(0);
  const {musicPlayerDisplayed} = useMusicPlayer();
  const {offlineMode} = useUser();

  const routes = useMemo(
    () => [
      ...(offlineMode
        ? []
        : [
            {
              key: 'Music',
              title: locales.tabs.music,
              focusedIcon: ({color}: any) => (
                <Ionicons name="musical-notes" color={color} size={24} />
              ),
              unfocusedIcon: ({color}: any) => (
                <Ionicons
                  name="musical-notes-outline"
                  color={color}
                  size={24}
                />
              ),
            },
            {
              key: 'Favorites',
              title: locales.tabs.favorites,
              focusedIcon: ({color}: any) => (
                <Ionicons name="heart" color={color} size={24} />
              ),
              unfocusedIcon: ({color}: any) => (
                <Ionicons name="heart-outline" color={color} size={24} />
              ),
            },
          ]),
      {
        key: 'Library',
        title: locales.tabs.library,
        focusedIcon: ({color}: any) => (
          <Ionicons name="library" color={color} size={24} />
        ),
        unfocusedIcon: ({color}: any) => (
          <Ionicons name="library-outline" color={color} size={24} />
        ),
      },
      {
        key: 'Settings',
        title: locales.tabs.settings,
        focusedIcon: ({color}: any) => (
          <Ionicons name="settings" color={color} size={24} />
        ),
        unfocusedIcon: ({color}: any) => (
          <Ionicons name="settings-outline" color={color} size={24} />
        ),
      },
    ],
    [offlineMode],
  );

  const TabContent = useMemo(
    () =>
      BottomNavigation.SceneMap(
        Object.assign(
          offlineMode
            ? {}
            : ({
                Music: MusicScreen,
                Favorites: FavoritesScreen,
              } as any),
          {
            Library: LibraryScreen,
            Settings: SettingsScreen,
          },
        ),
      ),
    [offlineMode],
  );

  return (
    <>
      {musicPlayerDisplayed ? (
        <MusicPlayerScreen />
      ) : (
        <BottomNavigation
          navigationState={{index, routes}}
          onIndexChange={setIndex}
          renderScene={props => (
            <View style={styles.content}>
              <TabContent {...props} />
              <BottomMusicPlayer />
            </View>
          )}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    height: '100%',
  },
});
