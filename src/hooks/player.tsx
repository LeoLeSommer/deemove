import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {Platform} from 'react-native';
import TrackPlayer, {
  Event,
  PlaybackTrackChangedEvent,
  RemoteSkipEvent,
  PlaybackStateEvent,
  State,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {match} from 'ts-pattern';
import useTrackStorage from './trackStorage';

export type PlayerState = 'stopped' | 'playing' | 'paused';

export type PlayerContext = {
  playTrack: (path: string) => Promise<void>;
  addTrackToQueue: (path: string) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  status: () => Promise<void>;
  state: PlayerState;
  currentTrack: string | null;
  previousTrack: string | null;
  nextTrack: string | null;
};

const PlayerContext = createContext<PlayerContext>({} as any);

export type PlayerProviderProps = {
  children: ReactNode;
};

export function PlayerProvider({children}: PlayerProviderProps) {
  const {tracks} = useTrackStorage();
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [nextTrack, setNextTrack] = useState<string | null>(null);
  const [previousTrack, setPreviousTrack] = useState<string | null>(null);
  const [state, setState] = useState<PlayerState>('stopped');

  // Initialize
  useEffect(() => {
    TrackPlayer.registerPlaybackService(() =>
      require('../utils/playerService'),
    );
    TrackPlayer.setupPlayer();
  }, []);

  // Track external event
  useTrackPlayerEvents([Event.RemotePlay], () => {
    TrackPlayer.play();
  });

  useTrackPlayerEvents([Event.RemotePause], () => {
    TrackPlayer.pause();
  });

  useTrackPlayerEvents([Event.RemoteNext], () => {
    TrackPlayer.skipToNext();
  });

  if (Platform.OS === 'android') {
    useTrackPlayerEvents([Event.RemoteSkip], (event: RemoteSkipEvent) => {
      TrackPlayer.skip(event.index);
    });
  }

  useTrackPlayerEvents([Event.RemotePrevious], () => {
    TrackPlayer.skipToPrevious();
  });

  useTrackPlayerEvents([Event.RemoteStop], () => {
    TrackPlayer.reset();
    setCurrentTrack(null);
    setNextTrack(null);
  });

  // Update current track id when the player is changing track
  useTrackPlayerEvents(
    [Event.PlaybackTrackChanged],
    async (event: PlaybackTrackChangedEvent) => {
      if (event.track) {
        const track = await TrackPlayer.getTrack(event.track);

        if (track) {
          setCurrentTrack(track.id);
        } else {
          setCurrentTrack(null);
        }
      }

      if (event.nextTrack) {
        const track = await TrackPlayer.getTrack(event.nextTrack);

        if (track) {
          setNextTrack(track.id);
        } else {
          setNextTrack(null);
        }
      }
    },
  );

  // Update player state

  useTrackPlayerEvents([Event.PlaybackState], (event: PlaybackStateEvent) => {
    setState(
      match(event.state)
        .with(State.None, () => 'stopped' as PlayerState)
        .with(State.Ready, () => 'playing' as PlayerState)
        .with(State.Playing, () => 'playing' as PlayerState)
        .with(State.Paused, () => 'paused' as PlayerState)
        .with(State.Stopped, () => 'stopped' as PlayerState)
        .with(State.Buffering, () => 'playing' as PlayerState)
        .with(State.Connecting, () => 'paused' as PlayerState)
        .otherwise(() => 'stopped' as PlayerState),
    );
  });

  const playTrack = useCallback(
    async (path: string) => {
      const track = tracks[path]?.track;

      if (track) {
        await TrackPlayer.reset();
        await TrackPlayer.add({
          id: path,
          url: path,
          title: track.title,
          artist: track.artist,
          album: track.album,
        });
        await TrackPlayer.play();

        setCurrentTrack(path);
        setNextTrack(null);
      }
    },
    [tracks],
  );

  const addTrackToQueue = useCallback(
    async (path: string) => {
      const track = tracks[path]?.track;

      if (track) {
        await TrackPlayer.add({
          id: path,
          url: path,
          title: track.title,
          artist: track.artist,
          album: track.album,
        });
      }
    },
    [tracks],
  );

  const play = useCallback(async () => {
    await TrackPlayer.play();
  }, []);

  const pause = useCallback(async () => {
    await TrackPlayer.pause();
  }, []);

  const stop = useCallback(async () => {
    await TrackPlayer.reset();
    setCurrentTrack(null);
    setNextTrack(null);
  }, []);

  const status = useCallback(async () => {
    await TrackPlayer.pause();
  }, []);

  const result = {
    playTrack,
    addTrackToQueue,
    play,
    pause,
    stop,
    status,
    state,
    currentTrack,
    previousTrack,
    nextTrack,
  };

  return (
    <PlayerContext.Provider value={result}>{children}</PlayerContext.Provider>
  );
}

export default function usePlayer(): PlayerContext {
  return useContext(PlayerContext);
}

export function usePlayerProgress() {
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
