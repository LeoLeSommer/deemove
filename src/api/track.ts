import {useDeezerEntry, useDeezerList} from '../hooks/api';
import {mapTrack} from '../models/Track';
import {escapeDoubleQuotes} from '../utils/string';

export function useTrack(id: string) {
  return useDeezerEntry(`track/${id}`, mapTrack);
}

export function useTrackFromLabels(
  track?: {
    artist: string;
    album: string;
    title: string;
  } | null,
) {
  const result = useDeezerList(
    'search',
    mapTrack,
    1,
    {
      q: `artist:"${escapeDoubleQuotes(
        track?.artist,
      )}" album:"${escapeDoubleQuotes(
        track?.album,
      )}" track:"${escapeDoubleQuotes(track?.title)}"`,
    },
    {
      abort: !track,
    },
  );

  return {
    ...result,
    data: (result?.data && result.data[0]) || null,
  };
}
