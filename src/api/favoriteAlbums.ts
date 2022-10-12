import {useQueryClient} from 'react-query';
import {useDeezerMutation} from '../hooks/api';
import useUser from '../hooks/user';
import {DEFAULT_FAVORITE_IDS, FavoriteIds, useFavoriteIds} from './favorites';

export function useIsFavoriteAlbum(albumId: string) {
  const {data} = useFavoriteIds();
  return data.albums.includes(albumId);
}

export function useLikeOrUnlikeAlbum(albumId: string) {
  const isFavorite = useIsFavoriteAlbum(albumId);
  const like = useLikeAlbum(albumId);
  const unlike = useUnlikeAlbum(albumId);

  if (isFavorite) {
    return unlike;
  } else {
    return like;
  }
}

export function useLikeAlbum(albumId: string) {
  const queryClient = useQueryClient();
  const {oldApiAccessToken} = useUser();

  return useDeezerMutation<void, void>('post', 'user/me/albums', () => ({
    params: {
      album_id: albumId,
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
            ? Object.assign(before, {albums: [...before.albums, albumId]})
            : DEFAULT_FAVORITE_IDS,
      ),
  }));
}

export function useUnlikeAlbum(albumId: string) {
  const queryClient = useQueryClient();
  const {oldApiAccessToken} = useUser();

  return useDeezerMutation<void, void>('delete', 'user/me/albums', () => ({
    params: {
      album_id: albumId,
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
                albums: before.albums.filter(elem => elem !== albumId),
              })
            : DEFAULT_FAVORITE_IDS,
      ),
  }));
}
