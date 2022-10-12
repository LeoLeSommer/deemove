import React, {
  useCallback,
  useState,
  useEffect,
  createContext,
  ReactNode,
  useContext,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SettingsContext = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => Promise<void>;
  downloadDirectory: string | null;
  setDownloadDirectory: (value: string) => Promise<void>;
  simultaneousDownloads: number;
  setSimultaneousDownloads: (value: number) => Promise<void>;
};

const SettingsContext = createContext<SettingsContext>({} as any);

export type SettingsProviderProps = {
  children: ReactNode;
};

export function SettingsProvider({children}: SettingsProviderProps) {
  const [darkMode, setDarkModeInternal] = useState(true);
  const [downloadDirectory, setDownloadDirectoryInternal] = useState<
    string | null
  >('content://com.android.externalstorage.documents/tree/primary%3AMusic');
  const [simultaneousDownloads, setSimultaneousDownloadsInternal] = useState(3);

  // Load dark mode from stored settings
  useEffect(() => {
    AsyncStorage.getItem('@dark_mode').then(value => {
      setDarkModeInternal(value === 'false' ? false : true);
    });
  }, []);

  const setDarkMode = useCallback(async (value: boolean) => {
    setDarkModeInternal(value);

    await AsyncStorage.setItem('@dark_mode', value ? 'true' : 'false');
  }, []);

  // Load download directory from stored settings
  useEffect(() => {
    AsyncStorage.getItem('@download_directory').then(value => {
      if (value) {
        setDownloadDirectoryInternal(value);
      }
    });
  }, []);

  const setDownloadDirectory = useCallback(async (value: string) => {
    setDownloadDirectoryInternal(value);

    await AsyncStorage.setItem('@download_directory', value);
  }, []);

  // Load simultaneous downloads from stored settings
  useEffect(() => {
    AsyncStorage.getItem('@simultaneous_downloads').then(value => {
      setSimultaneousDownloadsInternal((value && parseInt(value)) || 3);
    });
  }, []);

  const setSimultaneousDownloads = useCallback(async (value: number) => {
    setSimultaneousDownloadsInternal(value);

    await AsyncStorage.setItem('@simultaneous_downloads', value.toString());
  }, []);

  const result = {
    darkMode,
    setDarkMode,
    downloadDirectory,
    setDownloadDirectory,
    simultaneousDownloads,
    setSimultaneousDownloads,
  };

  return (
    <SettingsContext.Provider value={result}>
      {children}
    </SettingsContext.Provider>
  );
}

export default function useSettings(): SettingsContext {
  return useContext(SettingsContext);
}
