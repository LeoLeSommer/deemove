import {useDeezerOldApiEntry} from '../hooks/api';

export type FavoriteIds = {
  tracks: string[];
  artists: string[];
  albums: string[];
  playlists: string[];
};

export const DEFAULT_FAVORITE_IDS = {
  tracks: [],
  artists: [],
  albums: [],
  playlists: [],
};

export function useFavoriteIds() {
  const result = useDeezerOldApiEntry(
    'user.getAllFeedbacks',
    data => {
      const rawTracks = data?.FAVORITES?.SONGS?.data || [];
      const rawArtists = data?.FAVORITES?.ARTISTS?.data || [];
      const rawAlbums = data?.FAVORITES?.ALBUMS?.data || [];
      const rawPlaylists = data?.FAVORITES?.PLAYLISTS?.data || [];

      return {
        tracks: rawTracks.map((raw: any) => raw.SNG_ID),
        artists: rawArtists.map((raw: any) => raw.ART_ID),
        albums: rawAlbums.map((raw: any) => raw.ALB_ID),
        playlists: rawPlaylists.map((raw: any) => raw.PLAYLIST_ID),
      } as FavoriteIds;
    },
    {
      nb: 1000000,
      start: 0,
      checksum: null,
    },
  );

  return {
    ...result,
    data: result.data || DEFAULT_FAVORITE_IDS,
  };
}
