import React, {useCallback, useMemo} from 'react';
import {
  FlexAlignType,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Text} from 'react-native-paper';
import style from '../../constants/style';
import {Artist} from '../../models/Artist';
import {MusicParamList} from '../../screens/MusicScreen';

export type ArtistsGridProps = {
  artists: Artist[];
  itemPerLine?: number;
};

export default function ArtistsGrid({
  artists,
  itemPerLine = 2,
}: ArtistsGridProps) {
  const navigation = useNavigation<NativeStackNavigationProp<MusicParamList>>();
  const getSeeDetails = useCallback(
    (artist: Artist) => () => navigation.navigate('Artist', {id: artist.id}),
    [navigation],
  );

  const artistStyle = useMemo(
    () => ({
      width: `${100 / itemPerLine}%`,
      padding: style.margeXXS,
      alignItems: 'center' as FlexAlignType,
    }),
    [itemPerLine],
  );

  return (
    <View style={styles.container}>
      {artists.map(elem => (
        <TouchableOpacity
          key={elem.id}
          style={artistStyle}
          onPress={getSeeDetails(elem)}>
          <View style={styles.artistImageContainer}>
            <Image
              style={styles.artistImage}
              source={{uri: elem.imageMediumUrl}}
            />
          </View>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {elem.name}
          </Text>
        </TouchableOpacity>
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
  artistImageContainer: {
    width: '100%',
    borderRadius: 3000,
    overflow: 'hidden',
    aspectRatio: 1,
    marginBottom: style.margeSmall,
  },
  artistImage: {
    width: '100%',
    aspectRatio: 1,
  },
  title: {
    maxWidth: '100%',
  },
});
