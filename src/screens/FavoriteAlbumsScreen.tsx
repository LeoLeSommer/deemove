import React from 'react';
import {View, StyleSheet} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {useFavoriteAlbums} from '../api/user';
import ScrollView from '../components/display/ScrollView';
import AlbumsGrid from '../components/molecules/AlbumsGrid';
import style from '../constants/style';

export default function FavoriteAlbumsScreen() {
  const {data: albums, isLoading, fetchNext} = useFavoriteAlbums();

  return (
    <View>
      <ScrollView onEndReached={fetchNext} style={styles.container}>
        <Spinner visible={isLoading} />
        {albums.length > 0 && <AlbumsGrid albums={albums} itemPerLine={2} />}
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
