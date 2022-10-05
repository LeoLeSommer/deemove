import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Button, Title} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import SearchResultListItem from '../SearchResultListItem';
import {useSearch} from '../../../api/search';
import locales from '../../../locales';
import style from '../../../constants/style';

export type SearchPreviewProps = {
  searchQuery: string;
  setFilter: (filter: 'album' | 'artist' | 'playlist' | 'track' | null) => void;
};

export default function SearchPreview({
  searchQuery,
  setFilter,
}: SearchPreviewProps) {
  const {isLoading: isLoadingTracks, data: tracks} = useSearch(
    'track',
    searchQuery,
    2,
  );

  const {isLoading: isLoadingAlbums, data: albums} = useSearch(
    'album',
    searchQuery,
    2,
  );

  const {isLoading: isLoadingArtists, data: artists} = useSearch(
    'artist',
    searchQuery,
    2,
  );

  const {isLoading: isLoadingPlaylists, data: playlists} = useSearch(
    'playlist',
    searchQuery,
    2,
  );

  const isLoading =
    isLoadingTracks ||
    isLoadingAlbums ||
    isLoadingArtists ||
    isLoadingPlaylists;

  return (
    <>
      <Spinner visible={isLoading} />
      <ScrollView style={styles.container}>
        <Title>{locales.home.tracks}</Title>
        {tracks.map(elem => (
          <SearchResultListItem key={elem.id} item={elem} />
        ))}
        <Button mode="text" onPress={() => setFilter('track')} compact>
          {locales.home.displayEverything}
        </Button>
        <Title>{locales.home.artists}</Title>
        {artists.map(elem => (
          <SearchResultListItem key={elem.id} item={elem} />
        ))}
        <Button mode="text" onPress={() => setFilter('artist')} compact>
          {locales.home.displayEverything}
        </Button>
        <Title>{locales.home.albums}</Title>
        {albums.map(elem => (
          <SearchResultListItem key={elem.id} item={elem} />
        ))}
        <Button mode="text" onPress={() => setFilter('album')} compact>
          {locales.home.displayEverything}
        </Button>
        <Title>{locales.home.playlists}</Title>
        {playlists.map(elem => (
          <SearchResultListItem key={elem.id} item={elem} />
        ))}
        <Button mode="text" onPress={() => setFilter('playlist')} compact>
          {locales.home.displayEverything}
        </Button>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: style.margeSmall,
  },
});
