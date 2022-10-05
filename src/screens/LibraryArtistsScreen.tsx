import React from 'react';
import {View, StyleSheet} from 'react-native';
import ScrollView from '../components/display/ScrollView';
import ArtistsGrid from '../components/molecules/ArtistsGrid';
import style from '../constants/style';
import {useStoredArtists} from '../hooks/trackStorage';

export default function LibraryArtistsScreen() {
  const artists = useStoredArtists();

  return (
    <View>
      <ScrollView style={styles.container}>
        <ArtistsGrid artists={artists} />
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
