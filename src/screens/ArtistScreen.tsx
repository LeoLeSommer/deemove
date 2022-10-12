import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {RouteProp, useRoute} from '@react-navigation/native';
import {Title, useTheme} from 'react-native-paper';
import {
  useArtist,
  useArtistTopTracks,
  useArtistAlbums,
  useArtistPlaylists,
  useArtistRelatedArtists,
} from '../api/artist';
import EntryHeader from '../components/molecules/EntryHeader';
import {MusicParamList} from './MusicScreen';
import TrackListItem from '../components/molecules/TrackListItem';
import locales from '../locales';
import style from '../constants/style';
import ArtistsList from '../components/molecules/ArtistsList';
import PlaylistsList from '../components/molecules/PlaylistsList';
import AlbumsList from '../components/molecules/AlbumsList';
import {
  useIsFavoriteArtist,
  useLikeOrUnlikeArtist,
} from '../api/favoriteArtists';

export default function ArtistScreen() {
  const theme = useTheme();
  const route = useRoute<RouteProp<MusicParamList, 'Album'>>();
  const {data: artist, isLoading: isLoadingArtist} = useArtist(route.params.id);
  const {data: topTracks, isLoading: isLoadingTopTracks} = useArtistTopTracks(
    route.params.id,
  );
  const {data: albums, isLoading: isLoadingAlbums} = useArtistAlbums(
    route.params.id,
  );
  const {data: relatedArtists, isLoading: isLoadingRelatedArtists} =
    useArtistRelatedArtists(route.params.id);
  const {data: playlists, isLoading: isLoadingPlaylists} = useArtistPlaylists(
    route.params.id,
  );
  const isFavorite = useIsFavoriteArtist(route.params.id);
  const likeOrUnlike = useLikeOrUnlikeArtist(route.params.id);

  const containerStyle = {
    backgroundColor: theme.colors.background,
    width: '100%',
    height: '100%',
  };

  const isLoading =
    isLoadingArtist ||
    isLoadingTopTracks ||
    isLoadingAlbums ||
    isLoadingRelatedArtists ||
    isLoadingPlaylists;

  return (
    <SafeAreaView style={containerStyle}>
      <Spinner visible={isLoading} />
      <ScrollView>
        {artist && (
          <>
            <EntryHeader
              title={artist.name}
              imageUrl={artist.imageLargeUrl}
              isFavorite={isFavorite}
              likeOrUnlike={likeOrUnlike.mutateAsync}
              onListen={() => {}}
            />
            <View style={styles.container}>
              {topTracks.length > 0 && (
                <>
                  <Title>{locales.artist.topTracks}</Title>
                  {topTracks.map(track => (
                    <TrackListItem key={track.id} track={track} />
                  ))}
                </>
              )}
              {albums.length > 0 && (
                <>
                  <Title style={styles.title}>
                    {locales.artist.discography}
                  </Title>
                  <AlbumsList albums={albums} />
                </>
              )}
              {relatedArtists.length > 0 && (
                <>
                  <Title style={styles.title}>
                    {locales.artist.relatedArtists}
                  </Title>
                  <ArtistsList artists={relatedArtists} />
                </>
              )}
              {playlists.length > 0 && (
                <>
                  <Title style={styles.title}>{locales.artist.playlists}</Title>
                  <PlaylistsList playlists={playlists} />
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
