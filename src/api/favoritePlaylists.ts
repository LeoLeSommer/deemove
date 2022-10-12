import {useQueryClient} from 'react-query';
import {useDeezerMutation} from '../hooks/api';
import useUser from '../hooks/user';
import {DEFAULT_FAVORITE_IDS, FavoriteIds, useFavoriteIds} from './favorites';

export function useIsFavoritePlaylist(playlistId: string) {
  const {data} = useFavoriteIds();
  return data.playlists.includes(playlistId);
}

export function useLikeOrUnlikePlaylist(playlistId: string) {
  const isFavorite = useIsFavoritePlaylist(playlistId);
  const like = useLikePlaylist(playlistId);
  const unlike = useUnlikePlaylist(playlistId);

  if (isFavorite) {
    return unlike;
  } else {
    return like;
  }
}

export function useLikePlaylist(playlistId: string) {
  const queryClient = useQueryClient();
  const {oldApiAccessToken} = useUser();

  return useDeezerMutation<void, void>('post', 'user/me/playlists', () => ({
    params: {
      playlist_id: playlistId,
    },
    onSuccess: () =>
      queryClient.setQueryData<FavoriteIds>(
        [
          'user.getAllFeedbacks',
          oldApiAccessToken,
          JSON.stringify({
            nb: 1000000,
            start: 0,
            checksum: null,
          }),
          JSON.stringify({}),
        ],
        before =>
          before
            ? Object.assign(before, {
                playlists: [...before.playlists, playlistId],
              })
            : DEFAULT_FAVORITE_IDS,
      ),
  }));
}

export function useUnlikePlaylist(playlistId: string) {
  const queryClient = useQueryClient();
  const {oldApiAccessToken} = useUser();

  return useDeezerMutation<void, void>('delete', 'user/me/playlists', () => ({
    params: {
      playlist_id: playlistId,
    },
    onSuccess: () =>
      queryClient.setQueryData<FavoriteIds>(
        [
          'user.getAllFeedbacks',
          oldApiAccessToken,
          JSON.stringify({
            nb: 1000000,
            start: 0,
            checksum: null,
          }),
          JSON.stringify({}),
        ],
        before =>
          before
            ? Object.assign(before, {
                playlists: before.playlists.filter(elem => elem !== playlistId),
              })
            : DEFAULT_FAVORITE_IDS,
      ),
  }));
}
