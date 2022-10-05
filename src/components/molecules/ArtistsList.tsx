import React, {useCallback} from 'react';
import {StyleSheet, ScrollView, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Avatar, Text} from 'react-native-paper';
import style from '../../constants/style';
import {Artist} from '../../models/Artist';
import {MusicParamList} from '../../screens/MusicScreen';

export type ArtistsListProps = {
  artists: Artist[];
};

export default function ArtistsList({artists}: ArtistsListProps) {
  const navigation = useNavigation<NativeStackNavigationProp<MusicParamList>>();
  const getSeeDetails = useCallback(
    (artist: Artist) => () => navigation.navigate('Artist', {id: artist.id}),
    [navigation],
  );

  return (
    <ScrollView
      style={styles.container}
      horizontal
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      {artists.map(elem => (
        <View key={elem.id}>
          <TouchableOpacity onPress={getSeeDetails(elem)}>
            <View style={styles.artist}>
              <Avatar.Image
                style={styles.image}
                source={{uri: elem.imageMediumUrl}}
                size={120}
              />
              <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                {elem.name}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  artist: {
    alignItems: 'center',
    width: 140,
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    maxWidth: '100%',
  },
  image: {
    aspectRatio: 1,
    margin: style.margeXXS,
    borderRadius: 100,
  },
});
