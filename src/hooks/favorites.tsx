import {useEffect} from 'react';
import {useFavoriteTrackIds} from '../api/user';

export function useIsFavoriteTrack(trackId: string) {
  const {data} = useFavoriteTrackIds();

  return false;

  /*useEffect(() => {
    if (!isLoading) {
      fetchNext();
    }
  }, [isLoading, fetchNext]);

  return data.find(track => track.id === trackId) !== undefined;*/
}
