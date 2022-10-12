import {useQueryClient} from 'react-query';
import {useDeezerMutation} from '../hooks/api';
import useUser from '../hooks/user';
import {DEFAULT_FAVORITE_IDS, FavoriteIds, useFavoriteIds} from './favorites';

export function useIsFavoriteArtist(artistId: string) {
  const {data} = useFavoriteIds();
  return data.artists.includes(artistId);
}

export function useLikeOrUnlikeArtist(artistId: string) {
  const isFavorite = useIsFavoriteArtist(artistId);
  const like = useLikeArtist(artistId);
  const unlike = useUnlikeArtist(artistId);

  if (isFavorite) {
    return unlike;
  } else {
    return like;
  }
}

export function useLikeArtist(artistId: string) {
  const queryClient = useQueryClient();
  const {oldApiAccessToken} = useUser();

  return useDeezerMutation<void, void>('post', 'user/me/artists', () => ({
    params: {
      artist_id: artistId,
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
            ? Object.assign(before, {artists: [...before.artists, artistId]})
            : DEFAULT_FAVORITE_IDS,
      ),
  }));
}

export function useUnlikeArtist(artistId: string) {
  const queryClient = useQueryClient();
  const {oldApiAccessToken} = useUser();

  return useDeezerMutation<void, void>('delete', 'user/me/artists', () => ({
    params: {
      artist_id: artistId,
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
                artists: before.artists.filter(elem => elem !== artistId),
              })
            : DEFAULT_FAVORITE_IDS,
      ),
  }));
}
