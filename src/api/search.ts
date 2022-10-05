import {useDeezerList} from '../hooks/api';
import {mapSearchResult} from '../models/SearchResult';

export function useSearch(
  type: 'album' | 'artist' | 'playlist' | 'podcast' | 'radio' | 'track',
  query: string,
  limit?: number,
) {
  return useDeezerList(
    `search/${type}`,
    mapSearchResult,
    limit,
    {
      q: query,
    },
    {
      abort: query === '',
    },
  );
}
