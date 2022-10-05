import React from 'react';
import {View, StyleSheet} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {useFavoriteArtists} from '../api/user';
import ScrollView from '../components/display/ScrollView';
import ArtistsGrid from '../components/molecules/ArtistsGrid';
import style from '../constants/style';

export default function FavoriteArtistsScreen() {
  const {data: artists, isLoading, fetchNext} = useFavoriteArtists();

  return (
    <View>
      <ScrollView onEndReached={fetchNext} style={styles.container}>
        <Spinner visible={isLoading} />
        {artists.length > 0 && <ArtistsGrid artists={artists} />}
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
