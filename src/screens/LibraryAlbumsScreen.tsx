import React from 'react';
import {View, StyleSheet} from 'react-native';
import ScrollView from '../components/display/ScrollView';
import AlbumsGrid from '../components/molecules/AlbumsGrid';
import style from '../constants/style';
import {useStoredAlbums} from '../hooks/trackStorage';

export default function LibraryAlbumsScreen() {
  const albums = useStoredAlbums();

  return (
    <View>
      <ScrollView style={styles.container}>
        <AlbumsGrid itemPerLine={2} albums={albums} />
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
