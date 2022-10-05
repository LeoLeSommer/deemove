import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useTheme} from 'react-native-paper';
import EntryHeader from '../components/molecules/EntryHeader';
import {LibraryParamList} from './LibraryScreen';
import TrackListItem from '../components/molecules/TrackListItem';
import style from '../constants/style';
import {useStoredAlbum} from '../hooks/trackStorage';

export default function LibraryAlbumScreen() {
  const theme = useTheme();
  const route = useRoute<RouteProp<LibraryParamList, 'Album'>>();
  const album = useStoredAlbum(route.params.id);

  const containerStyle = {
    backgroundColor: theme.colors.background,
    width: '100%',
    height: '100%',
  };

  return (
    <SafeAreaView style={containerStyle}>
      <ScrollView>
        {album && (
          <>
            <EntryHeader
              title={album.name}
              imageUrl={album.imageLargeUrl}
              onListen={() => {}}
            />
            <View style={styles.container}>
              {album?.tracks?.map(track => (
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
  title: {
    marginTop: style.margeLarge,
  },
});
