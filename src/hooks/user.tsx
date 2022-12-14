import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNetInfo} from '@react-native-community/netinfo';
import {useLogin, getArlFromAccessToken, loginViaArl} from '../api/login';
import useCookie from './cookie';

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
  const {isInternetReachable} = useNetInfo();

  const callLogin = useLogin();
  const {setCookie} = useCookie();

  // Authenticate with stored tokens
  useEffect(() => {
    const fetchData = async () => {
      const storedAccessToken = await AsyncStorage.getItem('@auth_tokens');

      if (storedAccessToken) {
        const arl = await getArlFromAccessToken(storedAccessToken);
        const newOldApiAccessToken = await loginViaArl(arl, setCookie);

        setAccessToken(storedAccessToken);
        setOldApiAccessToken(newOldApiAccessToken);
      }
    };

    fetchData();
  }, [setCookie]);

  const login = useCallback(
    async (email: string, password: string) => {
      const {
        accessToken: newAccessToken,
        oldApiAccessToken: newOldApiAccessToken,
      } = await callLogin(email, password);

      await AsyncStorage.setItem('@auth_tokens', newAccessToken);

      setAccessToken(newAccessToken);
      setOldApiAccessToken(newOldApiAccessToken);
    },
    [callLogin],
  );

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('@auth_tokens');

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
    offlineMode: offlineMode || !isInternetReachable,
    login,
    logout,
    useOfflineMode,
  };

  return <UserContext.Provider value={result}>{children}</UserContext.Provider>;
}

export default function useUser(): UserContext {
  return useContext(UserContext) as any;
}
