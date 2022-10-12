import {useQueryClient} from 'react-query';
import {useDeezerMutation} from '../hooks/api';
import useUser from '../hooks/user';
import {DEFAULT_FAVORITE_IDS, FavoriteIds, useFavoriteIds} from './favorites';

export function useIsFavoriteTrack(trackId: string) {
  const {data} = useFavoriteIds();
  return data.tracks.includes(trackId);
}

export function useLikeOrUnlikeTrack(trackId: string) {
  const isFavorite = useIsFavoriteTrack(trackId);
  const like = useLikeTrack(trackId);
  const unlike = useUnlikeTrack(trackId);

  if (isFavorite) {
    return unlike;
  } else {
    return like;
  }
}

export function useLikeTrack(trackId: string) {
  const queryClient = useQueryClient();
  const {oldApiAccessToken} = useUser();

  return useDeezerMutation<void, void>('post', 'user/me/tracks', () => ({
    params: {
      track_id: trackId,
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
            ? Object.assign(before, {tracks: [...before.tracks, trackId]})
            : DEFAULT_FAVORITE_IDS,
      ),
  }));
}

export function useUnlikeTrack(trackId: string) {
  const queryClient = useQueryClient();
  const {oldApiAccessToken} = useUser();

  return useDeezerMutation<void, void>('delete', 'user/me/tracks', () => ({
    params: {
      track_id: trackId,
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
                tracks: before.tracks.filter(elem => elem !== trackId),
              })
            : DEFAULT_FAVORITE_IDS,
      ),
  }));
}
