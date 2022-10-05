import React, {useCallback} from 'react';
import {SafeAreaView} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import RNFetchBlob from 'react-native-blob-util';
import {Appbar, List, useTheme, Switch} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import path from 'path-browserify';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import useUser from '../hooks/user';
import useSettings from '../hooks/settings';
import locales from '../locales';
import {SettingsParamList} from './SettingsScreen';

export default function SettingsBaseScreen() {
  const {accessToken, offlineMode, logout} = useUser();
  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<SettingsParamList>>();
  const {darkMode, setDarkMode, downloadDirectory, setDownloadDirectory} =
    useSettings();

  const pickDownloadDirectory = useCallback(async () => {
    const newValue = await DocumentPicker.pickDirectory();

    if (newValue) {
      setDownloadDirectory(
        path.join(RNFetchBlob.fs.dirs.MusicDir),
        //path.join(RNFS.ExternalStorageDirectoryPath, 'Music'),
      );
    }
  }, [setDownloadDirectory]);

  const navigateToDownloadQueue = useCallback(
    () => navigation.navigate('DownloadQueue'),
    [navigation],
  );

  const containerStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
    width: '100%',
    height: '100%',
  };

  const copyTokenToClipboard = useCallback(() => {
    Clipboard.setString(accessToken || '');
  }, [accessToken]);

  return (
    <SafeAreaView style={containerStyle}>
      <Appbar.Header>
        <Appbar.Content title={locales.tabs.settings} />
      </Appbar.Header>
      <List.Item
        title={locales.settings.downloadQueue}
        onPress={navigateToDownloadQueue}
      />
      <List.Item
        title={locales.settings.darkMode}
        right={() => <Switch value={darkMode} onValueChange={setDarkMode} />}
      />
      <List.Item
        title={locales.settings.downloadDirectory}
        description={downloadDirectory}
        onPress={pickDownloadDirectory}
      />
      <List.Item
        title={
          offlineMode
            ? locales.settings.quitOfflineMode
            : locales.settings.logout
        }
        onPress={logout}
      />
      <List.Item
        title={locales.settings.copyTokenToClipboard}
        onPress={copyTokenToClipboard}
      />
    </SafeAreaView>
  );
}
