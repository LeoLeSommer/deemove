import React, {useCallback} from 'react';
import {Image, StyleSheet, View, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Text, TouchableRipple} from 'react-native-paper';
import style from '../../constants/style';
import {Album} from '../../models/Album';
import {MusicParamList} from '../../screens/MusicScreen';

export type AlbumsListProps = {
  albums: Album[];
};

export default function AlbumsList({albums}: AlbumsListProps) {
  const navigation = useNavigation<NativeStackNavigationProp<MusicParamList>>();
  const getSeeDetails = useCallback(
    (album: Album) => () => navigation.navigate('Album', {id: album.id}),
    [navigation],
  );

  return (
    <ScrollView
      style={styles.container}
      horizontal
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      {albums.map(elem => (
        <TouchableRipple
          key={elem.id}
          style={styles.album}
          onPress={getSeeDetails(elem)}>
          <View>
            <Image
              style={styles.albumImage}
              source={{uri: elem.imageMediumUrl}}
            />
            <Text numberOfLines={1} ellipsizeMode="tail">
              {elem.name}
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
  album: {
    width: 120,
    padding: style.margeXXS,
  },
  albumImage: {
    aspectRatio: 1,
  },
});
