import React, {useCallback, useMemo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Text, TouchableRipple} from 'react-native-paper';
import style from '../../constants/style';
import {Album} from '../../models/Album';
import {MusicParamList} from '../../screens/MusicScreen';

export type AlbumsGridProps = {
  albums: Album[];
  itemPerLine?: number;
};

export default function AlbumsGrid({albums, itemPerLine = 3}: AlbumsGridProps) {
  const navigation = useNavigation<NativeStackNavigationProp<MusicParamList>>();
  const getSeeDetails = useCallback(
    (album: Album) => () => navigation.navigate('Album', {id: album.id}),
    [navigation],
  );

  const albumStyle = useMemo(
    () => ({
      width: `${100 / itemPerLine}%`,
      padding: style.margeXXS,
    }),
    [itemPerLine],
  );

  return (
    <View style={styles.container}>
      {albums.map(elem => (
        <TouchableRipple
          key={elem.id}
          style={albumStyle}
          onPress={getSeeDetails(elem)}>
          <View>
            <Image
              style={styles.albumImage}
              source={{uri: elem.imageMediumUrl}}
            />
            <Text numberOfLines={2} ellipsizeMode="tail">
              {elem.name}
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
  albumImage: {
    aspectRatio: 1,
  },
});
