import React, {useMemo} from 'react';
import {
  Provider as PaperProvider,
  useTheme,
  MD3DarkTheme,
  MD3LightTheme,
  Provider,
  Snackbar,
  Text,
} from 'react-native-paper';
import {View} from 'react-native';
import {QueryClient, QueryClientProvider} from 'react-query';
import {TrackStorageProvider} from './hooks/trackStorage';
import MainTabsScreen from './screens/MainTabsScreen';
import LoginScreen from './screens/LoginScreen';
import {CookieProvider} from './hooks/cookie';
import useUser, {UserProvider} from './hooks/user';
import {PlayerProvider} from './hooks/player';
import useSettings, {SettingsProvider} from './hooks/settings';
import {DownloadQueueProvider} from './hooks/downloadQueue';
import {MusicPlayerProvider} from './hooks/musicPlayer';
import useError, {ErrorProvider} from './hooks/error';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorProvider>
        <SettingsProvider>
          <CookieProvider>
            <UserProvider>
              <TrackStorageProvider>
                <PlayerProvider>
                  <DownloadQueueProvider>
                    <MusicPlayerProvider>
                      <StyleContainer />
                    </MusicPlayerProvider>
                  </DownloadQueueProvider>
                </PlayerProvider>
              </TrackStorageProvider>
            </UserProvider>
          </CookieProvider>
        </SettingsProvider>
      </ErrorProvider>
    </QueryClientProvider>
  );
}

function StyleContainer() {
  const {darkMode} = useSettings();

  const theme = useMemo(
    () => (darkMode ? MD3DarkTheme : MD3LightTheme),
    [darkMode],
  );

  return (
    <PaperProvider theme={theme}>
      <Provider>
        <Container />
      </Provider>
    </PaperProvider>
  );
}

function Container() {
  const theme = useTheme();
  const {displayLogin} = useUser();
  const {currentError, popError} = useError();

  const containerStyle = {
    backgroundColor: theme.colors.background,
    width: '100%',
    height: '100%',
  };

  const snackbarStyle = {
    backgroundColor: theme.colors.errorContainer,
  };

  const snackbarTextStyle = {
    color: theme.colors.error,
  };

  return (
    <View style={containerStyle}>
      {displayLogin ? <LoginScreen /> : <MainTabsScreen />}
      <Snackbar
        visible={!!currentError}
        onDismiss={popError}
        style={snackbarStyle}>
        <Text style={snackbarTextStyle}>{currentError}</Text>
      </Snackbar>
    </View>
  );
}
