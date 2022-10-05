import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLogin} from '../api/login';

export type UserContext = {
  accessToken: string | null;
  oldApiAccessToken: string | null;
  displayLogin: boolean;
  isLogged: boolean;
  offlineMode: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  useOfflineMode: () => void;
};

const UserContext = createContext<UserContext | null>(null);

export type UserProviderProps = {
  children: ReactNode;
};

export function UserProvider({children}: UserProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [oldApiAccessToken, setOldApiAccessToken] = useState<string | null>(
    null,
  );
  const [offlineMode, setOfflineMode] = useState(false);
  let callLogin = useLogin();

  // Authenticate with stored tokens
  useEffect(() => {
    AsyncStorage.getItem('@auth_tokens').then(value => {
      if (value) {
        const tokens = JSON.parse(value);

        setAccessToken(tokens.accessToken);
        setOldApiAccessToken(tokens.oldApiAccessToken);
      }
    });
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const {
        accessToken: newAccessToken,
        oldApiAccessToken: newOldApiAccessToken,
      } = await callLogin(email, password);

      await AsyncStorage.setItem(
        '@auth_tokens',
        JSON.stringify({
          accessToken: newAccessToken,
          oldApiAccessToken: newOldApiAccessToken,
        }),
      );

      setAccessToken(newAccessToken);
      setOldApiAccessToken(newOldApiAccessToken);
    },
    [callLogin],
  );

  const logout = useCallback(async () => {
    setAccessToken(null);
    setOfflineMode(false);
  }, []);

  const useOfflineMode = useCallback(() => {
    setOfflineMode(true);
  }, []);

  const result = {
    accessToken,
    oldApiAccessToken,
    displayLogin: accessToken == null && !offlineMode,
    isLogged: accessToken != null,
    //offlineMode,
    offlineMode: true,
    login,
    logout,
    useOfflineMode,
  };

  return <UserContext.Provider value={result}>{children}</UserContext.Provider>;
}

export default function useUser(): UserContext {
  return useContext(UserContext) as any;
}
