import React, {useCallback} from 'react';
import {Image, StyleSheet, View, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Text, TouchableRipple} from 'react-native-paper';
import style from '../../constants/style';
import {Playlist} from '../../models/Playlist';
import {MusicParamList} from '../../screens/MusicScreen';

export type PlaylistsListProps = {
  playlists: Playlist[];
};

export default function PlaylistsList({playlists}: PlaylistsListProps) {
  const navigation = useNavigation<NativeStackNavigationProp<MusicParamList>>();
  const getSeeDetails = useCallback(
    (playlist: Playlist) => () =>
      navigation.navigate('Playlist', {id: playlist.id}),
    [navigation],
  );

  return (
    <ScrollView
      style={styles.container}
      horizontal
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      {playlists.map(elem => (
        <TouchableRipple
          key={elem.id}
          style={styles.playlist}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  playlist: {
    width: 120,
    padding: style.margeXXS,
  },
  playlistImage: {
    aspectRatio: 1,
  },
});
