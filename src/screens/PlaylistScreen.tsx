import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useTheme} from 'react-native-paper';
import {usePlaylist} from '../api/playlist';
import EntryHeader from '../components/molecules/EntryHeader';
import {MusicParamList} from './MusicScreen';
import TrackListItem from '../components/molecules/TrackListItem';
import style from '../constants/style';

export default function PlaylistScreen() {
  const theme = useTheme();
  const route = useRoute<RouteProp<MusicParamList, 'Playlist'>>();
  const {data: playlist, isLoading} = usePlaylist(route.params.id);

  const containerStyle = {
    backgroundColor: theme.colors.background,
    width: '100%',
    height: '100%',
  };

  return (
    <SafeAreaView style={containerStyle}>
      <Spinner visible={isLoading} />
      <ScrollView>
        {playlist && (
          <>
            <EntryHeader
              title={playlist.title}
              imageUrl={playlist.imageLargeUrl}
              onListen={() => {}}
            />
            <View style={styles.container}>
              {playlist?.tracks?.map(track => (
                <TrackListItem key={track.id} track={track} />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: style.margeSmall,
  },
});
