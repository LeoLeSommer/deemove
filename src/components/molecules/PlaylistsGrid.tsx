import React, {useCallback, useMemo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Text, TouchableRipple} from 'react-native-paper';
import style from '../../constants/style';
import {Playlist} from '../../models/Playlist';
import {MusicParamList} from '../../screens/MusicScreen';

export type PlaylistsGridProps = {
  playlists: Playlist[];
  itemPerLine?: number;
};

export default function PlaylistsGrid({
  playlists,
  itemPerLine = 3,
}: PlaylistsGridProps) {
  const navigation = useNavigation<NativeStackNavigationProp<MusicParamList>>();
  const getSeeDetails = useCallback(
    (playlist: Playlist) => () =>
      navigation.navigate('Playlist', {id: playlist.id}),
    [navigation],
  );

  const playlistStyle = useMemo(
    () => ({
      width: `${100 / itemPerLine}%`,
      padding: style.margeXXS,
    }),
    [itemPerLine],
  );

  return (
    <View style={styles.container}>
      {playlists.map(elem => (
        <TouchableRipple
          key={elem.id}
          style={playlistStyle}
          onPress={getSeeDetails(elem)}>
          <View>
            <Image
              style={styles.playlistImage}
              source={{uri: elem.imageMediumUrl}}
            />
            <Text numberOfLines={2} ellipsizeMode="tail">
              {elem.title}
            </Text>
          </View>
        </TouchableRipple>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: style.margeSmall,
  },

  playlistImage: {
    aspectRatio: 1,
  },
});
