import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from 'react';

export type MusicPlayerContext = {
  musicPlayerDisplayed: boolean;
  showMusicPlayer: () => void;
  hideMusicPlayer: () => void;
};

const MusicPlayerContext = createContext<MusicPlayerContext>({} as any);

export type MusicPlayerProviderProps = {
  children: ReactNode;
};

export function MusicPlayerProvider({children}: MusicPlayerProviderProps) {
  const [musicPlayerDisplayed, setMusicPlayerDisplayed] = useState(false);

  const showMusicPlayer = useCallback(() => setMusicPlayerDisplayed(true), []);
  const hideMusicPlayer = useCallback(() => setMusicPlayerDisplayed(false), []);

  const result = {
    musicPlayerDisplayed,
    showMusicPlayer,
    hideMusicPlayer,
  };

  return (
    <MusicPlayerContext.Provider value={result}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export default function useMusicPlayer(): MusicPlayerContext {
  return useContext(MusicPlayerContext);
}
