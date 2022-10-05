import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDownloadTrack} from '../api/download';
import useUser from './user';

export type DownloadQueueElem = {
  trackId: string;
  status: 'downloading' | 'pending';
};

export type DownloadQueueContext = {
  downloadQueue: DownloadQueueElem[];
  setDownloadQueue: (value: DownloadQueueElem[]) => void;
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
  const [downloadQueue, setDownloadQueue] = useState<DownloadQueueElem[]>([]);
  const downloadTrack = useDownloadTrack();

  // Persists download queue
  useEffect(() => {
    AsyncStorage.getItem('@download_queue').then(value => {
      if (value) {
        const stored = JSON.parse(value) || [];

        setDownloadQueue(
          stored.map((elem: any) => ({
            trackId: elem.trackId,
            status: 'pending',
          })),
        );
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@download_queue', JSON.stringify(downloadQueue));
  }, [downloadQueue]);

  const addToDownloadQueue = useCallback(
    (trackId: string) => {
      setDownloadQueue([...downloadQueue, {trackId, status: 'pending'}]);
    },
    [downloadQueue],
  );

  const removeFromDownloadQueue = useCallback(
    (trackId: string) => {
      setDownloadQueue(
        downloadQueue.filter(
          elem => !(elem.trackId === trackId && elem.status === 'pending'),
        ),
      );
    },
    [downloadQueue],
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
    const newDownloadQueue = [...downloadQueue];
    newDownloadQueue[elemToDownloadIndex] = {
      ...newDownloadQueue[elemToDownloadIndex],
      status: 'downloading',
    };
    setDownloadQueue(newDownloadQueue);

    // Launch the download process
    downloadTrack(trackId).then(() => {
      removeFromDownloadQueue(trackId);
    });
  }, [isLogged, downloadQueue, downloadTrack, removeFromDownloadQueue]);

  const result = {
    downloadQueue,
    setDownloadQueue,
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
