import {useDeezerEntry} from '../hooks/api';
import {mapAlbum} from '../models/Album';

export function useAlbum(id: string) {
  return useDeezerEntry(`album/${id}`, mapAlbum);
}
