import {mapTrack, Track} from '../models/Track';
import {mapArtist, Artist} from '../models/Artist';
import {mapPlaylist, Playlist} from '../models/Playlist';
import {mapAlbum, Album} from '../models/Album';
import {useDeezerEntry, useDeezerList} from '../hooks/api';

export function useFavoriteTracks(limit?: number) {
  return useDeezerList('user/me/tracks', mapTrack, limit);
}

export function useFavoriteAlbums(limit?: number) {
  return useDeezerList('user/me/albums', mapAlbum, limit);
}

export function useFavoriteArtists(limit?: number) {
  return useDeezerList('user/me/artists', mapArtist, limit);
}

export function useFavoritePlaylists(limit?: number) {
  return useDeezerList('user/me/playlists', mapPlaylist, limit);
}

export function useRecommendedTracks(limit?: number) {
  return useDeezerList('user/me/recommendations/tracks', mapTrack, limit);
}

export function useRecommendedArtists(limit?: number) {
  return useDeezerList('user/me/recommendations/artists', mapArtist, limit);
}

export function useRecommendedPlaylists(limit?: number) {
  return useDeezerList('user/me/recommendations/playlists', mapPlaylist, limit);
}

export function useTrendy() {
  const result = useDeezerEntry(
    'editorial/0/charts',
    data =>
      ({
        trendyTracks: data?.tracks?.data ? data.tracks.data.map(mapTrack) : [],
        trendyAlbums: data?.albums?.data ? data.albums.data.map(mapAlbum) : [],
        trendyArtists: data?.artists?.data
          ? data.artists.data.map(mapArtist)
          : [],
        trendyPlaylists: data?.playlists?.data
          ? data.playlists.data.map(mapPlaylist)
          : [],
      } as {
        trendyTracks: Track[];
        trendyAlbums: Album[];
        trendyArtists: Artist[];
        trendyPlaylists: Playlist[];
      }),
  );

  return {
    ...result,
    data: result.data || {
      trendyTracks: [],
      trendyAlbums: [],
      trendyArtists: [],
      trendyPlaylists: [],
    },
  };
}
