import {useCallback} from 'react';
import axios from 'axios';
import useUser from '../hooks/user';
import {useIsFavoriteTrack} from '../hooks/favorites';
import {useDeezerEntry} from '../hooks/api';
import {mapTrack} from '../models/Track';

export function useTrack(id: string) {
  return useDeezerEntry(`track/${id}`, mapTrack);
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
  const {accessToken} = useUser();

  return useCallback(
    () =>
      axios.post('https://api.deezer.com/user/me/tracks', {
        params: {
          access_token: accessToken,
        },
        data: {
          track_id: trackId,
        },
      }),
    [accessToken, trackId],
  );
}

export function useUnlikeTrack(trackId: string) {
  const {accessToken} = useUser();

  return useCallback(
    () =>
      axios.delete('https://api.deezer.com/user/me/tracks', {
        params: {
          access_token: accessToken,
        },
        data: {
          track_id: trackId,
        },
      }),
    [accessToken, trackId],
  );
}
