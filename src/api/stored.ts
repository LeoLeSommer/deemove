import {useMemo} from 'react';
import useSettings from '../hooks/settings';
import useTrackStorage from '../hooks/trackStorage';
import {getTrackFilepath} from './download';

export type TrackStatus =
  | 'not-downloaded'
  | 'downloaded'
  | 'downloading'
  | 'loading-filesystem';

export function useTrackStatus(track: {
  title: string;
  album: string;
  artist: string;
}): TrackStatus {
  const {downloadDirectory} = useSettings();
  const {tracks} = useTrackStorage();
  const filepath = getTrackFilepath(downloadDirectory, track);

  return useMemo(() => {
    if (!filepath || !tracks[filepath]) {
      return 'not-downloaded';
    }

    if (tracks[filepath].alreadyDownloaded) {
      return 'downloaded';
    }

    if (tracks[filepath].isDownloading) {
      return 'downloading';
    }

    if (tracks[filepath].isLoadingFilesystem) {
      return 'loading-filesystem';
    }

    return 'not-downloaded';
  }, [tracks, filepath]);
}
