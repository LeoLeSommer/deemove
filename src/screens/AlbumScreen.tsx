import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useTheme} from 'react-native-paper';
import {useAlbum} from '../api/album';
import EntryHeader from '../components/molecules/EntryHeader';
import {MusicParamList} from './MusicScreen';
import TrackListItem from '../components/molecules/TrackListItem';
import style from '../constants/style';
import {useIsFavoriteAlbum, useLikeOrUnlikeAlbum} from '../api/favoriteAlbums';

export default function AlbumScreen() {
  const theme = useTheme();
  const route = useRoute<RouteProp<MusicParamList, 'Album'>>();
  const {data: album, isLoading} = useAlbum(route.params.id);
  const isFavorite = useIsFavoriteAlbum(route.params.id);
  const likeOrUnlike = useLikeOrUnlikeAlbum(route.params.id);

  const containerStyle = {
    backgroundColor: theme.colors.background,
    width: '100%',
    height: '100%',
  };

  return (
    <SafeAreaView style={containerStyle}>
      <Spinner visible={isLoading} />
      <ScrollView>
        {album && (
          <>
            <EntryHeader
              title={album.name}
              imageUrl={album.imageLargeUrl}
              isFavorite={isFavorite}
              likeOrUnlike={likeOrUnlike.mutateAsync}
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
});
