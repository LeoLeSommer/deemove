import {useDeezerEntry} from '../hooks/api';
import {mapPlaylist} from '../models/Playlist';

export function usePlaylist(id: string) {
  return useDeezerEntry(`playlist/${id}`, mapPlaylist);
}
