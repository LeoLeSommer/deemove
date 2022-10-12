import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDownloadTrack} from '../api/download';
import useUser from './user';
import useTrackStorage, {DownloadQueueElem} from './trackStorage';

export type DownloadQueueContext = {
  downloadQueue: DownloadQueueElem[];
  addToDownloadQueue: (trackId: string) => void;
  removeFromDownloadQueue: (trackId: string) => void;
  isInDownloadQueue: (trackId: string) => boolean;
};

const DownloadQueueContext = createContext<DownloadQueueContext>({} as any);

export type DownloadQueueProviderProps = {
  children: ReactNode;
};

// TODO: create a settings for that
const maximumParallelDownload = 2;

export function DownloadQueueProvider({children}: DownloadQueueProviderProps) {
  const {isLogged} = useUser();
  const downloadTrack = useDownloadTrack();
  const {downloadQueue, dispatch} = useTrackStorage();

  // Persists download queue
  useEffect(() => {
    AsyncStorage.getItem('@download_queue').then(value => {
      if (value) {
        const stored = JSON.parse(value) || [];
        dispatch({
          type: 'DOWNLOAD_QUEUE_LOADED',
          trackIds: stored,
        });
      }
    });
  }, [dispatch]);

  useEffect(() => {
    AsyncStorage.setItem(
      '@download_queue',
      JSON.stringify(downloadQueue.map(elem => elem.trackId)),
    );
  }, [downloadQueue]);

  const addToDownloadQueue = useCallback(
    (trackId: string) => {
      dispatch({
        type: 'DOWNLOAD_REQUESTED',
        trackId,
      });
    },
    [dispatch],
  );

  const removeFromDownloadQueue = useCallback(
    (trackId: string) => {
      dispatch({
        type: 'DOWNLOAD_REQUEST_REMOVED',
        trackId,
      });
    },
    [dispatch],
  );

  const isInDownloadQueue = useCallback(
    (trackId: string) => {
      return downloadQueue.find(elem => elem.trackId === trackId) !== undefined;
    },
    [downloadQueue],
  );

  // Launch download if needed
  useEffect(() => {
    if (!isLogged) {
      return;
    }

    // Check if we have remaining space for a download
    if (
      downloadQueue.filter(elem => elem.status === 'downloading').length >=
      maximumParallelDownload
    ) {
      return;
    }

    // Select the first track that is waiting for a download
    const elemToDownloadIndex = downloadQueue.findIndex(
      elem => elem.status === 'pending',
    );

    // Cancel if there is no tracks remaining
    if (elemToDownloadIndex === -1) {
      return;
    }

    // Update the status in the download queue
    const trackId = downloadQueue[elemToDownloadIndex].trackId;

    // Launch the download process
    downloadTrack(trackId);
  }, [isLogged, downloadQueue, downloadTrack, removeFromDownloadQueue]);

  const result = {
    downloadQueue,
    addToDownloadQueue,
    removeFromDownloadQueue,
    isInDownloadQueue,
  };

  return (
    <DownloadQueueContext.Provider value={result}>
      {children}
    </DownloadQueueContext.Provider>
  );
}

export default function useDownloadQueue(): DownloadQueueContext {
  return useContext(DownloadQueueContext);
}
