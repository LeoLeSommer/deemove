import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from 'react';

export type MusicPlayerScreenContext = {
  musicPlayerDisplayed: boolean;
  showMusicPlayer: () => void;
  hideMusicPlayer: () => void;
};

const MusicPlayerScreenContext = createContext<MusicPlayerScreenContext>(
  {} as any,
);

export type MusicPlayerScreenProviderProps = {
  children: ReactNode;
};

export function MusicPlayerScreenProvider({
  children,
}: MusicPlayerScreenProviderProps) {
  const [musicPlayerDisplayed, setMusicPlayerDisplayed] = useState(false);

  const showMusicPlayer = useCallback(() => setMusicPlayerDisplayed(true), []);
  const hideMusicPlayer = useCallback(() => setMusicPlayerDisplayed(false), []);

  const result = {
    musicPlayerDisplayed,
    showMusicPlayer,
    hideMusicPlayer,
  };

  return (
    <MusicPlayerScreenContext.Provider value={result}>
      {children}
    </MusicPlayerScreenContext.Provider>
  );
}

export default function useMusicPlayerScreen(): MusicPlayerScreenContext {
  return useContext(MusicPlayerScreenContext);
}
