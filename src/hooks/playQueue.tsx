import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import TrackPlayer, {
  Event,
  PlaybackStateEvent,
  State,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {match} from 'ts-pattern';
import {LocalTrack} from '../models/LocalTrack';
import {Track} from '../models/Track';

export type PlayQueueState = 'stopped' | 'playing' | 'paused';

export type PlayQueueSource =
  | {
      type: 'stored';
      track: LocalTrack;
    }
  | {
      type: 'remote';
      track: Track;
    };

export type PlayQueueContext = {
  playTrack: (src: PlayQueueSource) => void;
  addTrackToQueue: (src: PlayQueueSource) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  isPlayingTrack: (src: PlayQueueSource) => boolean;
  track: {
    title: string;
    artist: string;
    album: string;
    coverPath: string;
  } | null;
  state: PlayQueueState;
  hasPreviousTrack: boolean;
  hasNextTrack: boolean;
};

const PlayQueueContext = createContext<PlayQueueContext>({} as any);

export type PlayQueueProviderProps = {
  children: ReactNode;
};

export function PlayQueueProvider({children}: PlayQueueProviderProps) {
  const [queue, setQueue] = useState<PlayQueueSource[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState<PlayQueueState>('stopped');
  const currentSource = queue[currentIndex];

  // Initialize
  useEffect(() => {
    TrackPlayer.registerPlaybackService(() =>
      require('../utils/playerService'),
    );
    TrackPlayer.setupPlayer();
  }, []);

  const playTrack = useCallback((src: PlayQueueSource) => {
    setQueue([src]);
    setCurrentIndex(0);
  }, []);

  const addTrackToQueue = useCallback(
    (src: PlayQueueSource) => {
      setQueue([...queue, src]);
    },
    [queue],
  );

  const play = useCallback(() => {
    TrackPlayer.play();
  }, []);

  const pause = useCallback(() => {
    TrackPlayer.pause();
  }, []);

  const stop = useCallback(() => {
    TrackPlayer.reset();
    setQueue([]);
    setCurrentIndex(0);
  }, []);

  const hasNextTrack = useMemo(
    () => currentIndex < queue.length - 1,
    [queue, currentIndex],
  );

  const hasPreviousTrack = useMemo(() => currentIndex > 0, [currentIndex]);

  const next = useCallback(() => {
    if (hasNextTrack) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, hasNextTrack]);

  const previous = useCallback(() => {
    if (hasPreviousTrack) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, hasPreviousTrack]);

  const isPlayingTrack = useCallback(
    (src: PlayQueueSource) => {
      return (
        currentSource &&
        src.type === currentSource.type &&
        match(src)
          .with(
            {type: 'stored'},
            elem =>
              elem.track.path === (currentSource.track as LocalTrack).path,
          )
          .with(
            {type: 'remote'},
            elem => elem.track.id === (currentSource.track as Track).id,
          )
          .exhaustive()
      );
    },
    [currentSource],
  );

  // Track external event
  useTrackPlayerEvents([Event.RemotePlay], () => {
    play();
  });

  useTrackPlayerEvents([Event.RemotePause], () => {
    pause();
  });

  useTrackPlayerEvents([Event.RemoteStop], () => {
    stop();
  });

  useTrackPlayerEvents([Event.RemoteNext], () => {
    next();
  });

  useTrackPlayerEvents([Event.RemotePrevious], () => {
    previous();
  });

  // The track is over so we need to load the next music if we can
  useTrackPlayerEvents([Event.PlaybackQueueEnded], () => {
    next();
  });

  // When the track index change, we load the next track
  useEffect(() => {
    const isPlayingTrackId = async (id: string) => {
      const trackIndex = await TrackPlayer.getCurrentTrack();

      if (trackIndex === null) {
        return false;
      }

      const track = await TrackPlayer.getTrack(trackIndex);

      if (track === null) {
        return false;
      }

      return track.id === id;
    };

    const fetchData = async (src: PlayQueueSource) => {
      if (src.type === 'stored') {
        if (!(await isPlayingTrackId(src.track.path))) {
          await TrackPlayer.reset();
          await TrackPlayer.add({
            id: src.track.path,
            url: src.track.path,
            title: src.track.title,
            artist: src.track.artist,
            album: src.track.album,
          });
          await TrackPlayer.play();
        }
      } else if (src.type === 'remote') {
        if (!(await isPlayingTrackId(src.track.id))) {
          return;
        }
      }
    };

    fetchData(currentSource);
  }, [currentSource]);

  // Update player state
  useTrackPlayerEvents([Event.PlaybackState], (event: PlaybackStateEvent) => {
    setState(
      match(event.state)
        .with(State.None, () => 'stopped' as PlayQueueState)
        .with(State.Ready, () => 'playing' as PlayQueueState)
        .with(State.Playing, () => 'playing' as PlayQueueState)
        .with(State.Paused, () => 'paused' as PlayQueueState)
        .with(State.Stopped, () => 'stopped' as PlayQueueState)
        .with(State.Buffering, () => 'playing' as PlayQueueState)
        .with(State.Connecting, () => 'paused' as PlayQueueState)
        .otherwise(() => 'stopped' as PlayQueueState),
    );
  });

  const result = {
    playTrack,
    addTrackToQueue,
    play,
    pause,
    stop,
    next,
    previous,
    isPlayingTrack,
    track: currentSource?.track
      ? {
          ...currentSource.track,
          coverPath:
            (currentSource.track as LocalTrack).coverPath ||
            (currentSource.track as Track).imageLargeUrl,
        }
      : null,
    state,
    hasPreviousTrack,
    hasNextTrack,
  };

  return (
    <PlayQueueContext.Provider value={result}>
      {children}
    </PlayQueueContext.Provider>
  );
}

export default function usePlayQueue(): PlayQueueContext {
  return useContext(PlayQueueContext);
}

export function usePlayProgress() {
  const {duration, position} = useProgress();
  const setProgress = useCallback(
    async (value: number) => {
      await TrackPlayer.seekTo(value * duration);
    },
    [duration],
  );

  return {
    progress: position / (duration || 1),
    setProgress,
  };
}
