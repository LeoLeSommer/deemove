import React, {useCallback, useState} from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import RNFetchBlob from 'react-native-blob-util';
import {Appbar, List, useTheme, Switch, Menu} from 'react-native-paper';
import {selectDirectory} from 'react-native-directory-picker';
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
  const {
    darkMode,
    setDarkMode,
    downloadDirectory,
    setDownloadDirectory,
    simultaneousDownloads,
    setSimultaneousDownloads: internalSetSimultaneousDownloads,
  } = useSettings();
  const [pickSimultaneousDownloads, setPickSimultaneousDownloads] =
    useState(false);

  const pickDownloadDirectory = useCallback(async () => {
    const result = await selectDirectory();
    const newDirectory = result && (await RNFetchBlob.fs.stat(result)).path;

    if (newDirectory) {
      setDownloadDirectory(newDirectory);
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

  const setSimultaneousDownloads = useCallback(
    (value: number) => {
      internalSetSimultaneousDownloads(value);
      setPickSimultaneousDownloads(false);
    },
    [internalSetSimultaneousDownloads],
  );

  return (
    <SafeAreaView style={containerStyle}>
      <Appbar.Header>
        <Appbar.Content title={locales.tabs.settings} />
      </Appbar.Header>
      <ScrollView>
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
        <Menu
          visible={pickSimultaneousDownloads}
          onDismiss={() => setPickSimultaneousDownloads(false)}
          anchor={
            <List.Item
              title={locales.settings.simultaneousDownloads}
              description={simultaneousDownloads}
              onPress={() => setPickSimultaneousDownloads(true)}
            />
          }>
          <Menu.Item onPress={() => setSimultaneousDownloads(1)} title="1" />
          <Menu.Item onPress={() => setSimultaneousDownloads(2)} title="2" />
          <Menu.Item onPress={() => setSimultaneousDownloads(3)} title="3" />
          <Menu.Item onPress={() => setSimultaneousDownloads(4)} title="4" />
          <Menu.Item onPress={() => setSimultaneousDownloads(5)} title="5" />
          <Menu.Item onPress={() => setSimultaneousDownloads(6)} title="6" />
          <Menu.Item onPress={() => setSimultaneousDownloads(7)} title="7" />
          <Menu.Item onPress={() => setSimultaneousDownloads(8)} title="8" />
          <Menu.Item onPress={() => setSimultaneousDownloads(9)} title="9" />
          <Menu.Item onPress={() => setSimultaneousDownloads(10)} title="10" />
        </Menu>

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
      </ScrollView>
    </SafeAreaView>
  );
}
