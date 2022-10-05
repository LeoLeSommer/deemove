import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {Title, useTheme} from 'react-native-paper';
import EntryHeader from '../components/molecules/EntryHeader';
import {LibraryParamList} from './LibraryScreen';
import TrackListItem from '../components/molecules/TrackListItem';
import locales from '../locales';
import style from '../constants/style';
import AlbumsList from '../components/molecules/AlbumsList';
import {
  useStoredArtist,
  useStoredArtistAlbums,
  useStoredArtistTracks,
} from '../hooks/trackStorage';

export default function LibraryArtistScreen() {
  const theme = useTheme();
  const route = useRoute<RouteProp<LibraryParamList, 'Artist'>>();
  const artist = useStoredArtist(route.params.id);
  const albums = useStoredArtistAlbums(route.params.id);
  const tracks = useStoredArtistTracks(route.params.id);

  const containerStyle = {
    backgroundColor: theme.colors.background,
    width: '100%',
    height: '100%',
  };

  return (
    <SafeAreaView style={containerStyle}>
      <ScrollView>
        {artist && (
          <>
            <EntryHeader
              title={artist.name}
              imageUrl={artist.imageLargeUrl}
              onListen={() => {}}
            />
            <View style={styles.container}>
              {albums.length > 0 && (
                <>
                  <Title style={styles.title}>
                    {locales.artist.discography}
                  </Title>
                  <AlbumsList albums={albums} />
                </>
              )}
              {tracks.length > 0 && (
                <>
                  <Title style={styles.title}>{locales.artist.tracks}</Title>
                  {tracks.map(track => (
                    <TrackListItem key={track.id} track={track} />
                  ))}
                </>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: style.margeSmall,
  },
  title: {
    marginTop: style.margeLarge,
  },
});
