import React from 'react';
import {View, StyleSheet} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {useFavoritePlaylists} from '../api/user';
import ScrollView from '../components/display/ScrollView';
import PlaylistsGrid from '../components/molecules/PlaylistsGrid';
import style from '../constants/style';

export default function FavoritePlaylistsScreen() {
  const {data: playlists, isLoading, fetchNext} = useFavoritePlaylists();

  return (
    <View>
      <ScrollView onEndReached={fetchNext} style={styles.container}>
        <Spinner visible={isLoading} />
        {playlists.length > 0 && (
          <PlaylistsGrid playlists={playlists} itemPerLine={2} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: style.margeSmall,
    marginLeft: style.margeSmall,
  },
});
