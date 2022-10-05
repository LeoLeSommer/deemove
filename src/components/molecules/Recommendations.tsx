import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Title} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import locales from '../../locales';
import style from '../../constants/style';
import {
  useRecommendedArtists,
  useRecommendedPlaylists,
  useRecommendedTracks,
  useTrendy,
} from '../../api/user';
import TracksGrid from './TracksGrid';
import PlaylistsGrid from './PlaylistsGrid';
import AlbumsGrid from './AlbumsGrid';
import ArtistsList from './ArtistsList';

export default function Recommendations() {
  const {data: artists, isLoading: isLoadingArtists} = useRecommendedArtists();
  const {data: tracks, isLoading: isLoadingTracks} = useRecommendedTracks();
  const {data: playlists, isLoading: isLoadingPlaylists} =
    useRecommendedPlaylists();
  const {
    data: {trendyTracks, trendyAlbums, trendyArtists, trendyPlaylists},
    isLoading: isLoadingTrendy,
  } = useTrendy();

  const isLoading =
    isLoadingArtists ||
    isLoadingTracks ||
    isLoadingPlaylists ||
    isLoadingTrendy;

  return (
    <ScrollView style={styles.container}>
      <Spinner visible={isLoading} />
      <Title>{locales.home.recommendedArtists}</Title>
      <ArtistsList artists={artists} />
      <Title style={styles.title}>{locales.home.recommendedTracks}</Title>
      <TracksGrid tracks={tracks} />
      <Title style={styles.title}>{locales.home.recommendedPaylists}</Title>
      <PlaylistsGrid playlists={playlists.slice(0, 9)} />
      <Title style={styles.title}>{locales.home.trendyTracks}</Title>
      <TracksGrid tracks={trendyTracks} />
      <Title style={styles.title}>{locales.home.trendyAlbums}</Title>
      <AlbumsGrid albums={trendyAlbums.slice(0, 9)} />
      <Title style={styles.title}>{locales.home.trendyArtists}</Title>
      <ArtistsList artists={trendyArtists} />
      <Title style={styles.title}>{locales.home.trendyPlaylists}</Title>
      <PlaylistsGrid playlists={trendyPlaylists.slice(0, 9)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: style.margeSmall,
    marginVertical: style.margeSmall,
  },
  title: {
    marginTop: style.margeLarge,
  },
});
