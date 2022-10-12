import React, {useCallback} from 'react';
import {Avatar, List} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {match} from 'ts-pattern';
import {SearchResult} from '../../models/SearchResult';
import TrackListItem from './TrackListItem';
import {MusicParamList} from '../../screens/MusicScreen';

export type SearchResultListItemProps = {
  item: SearchResult;
};

export default function SearchResultListItem({
  item,
}: SearchResultListItemProps) {
  const navigation = useNavigation<NativeStackNavigationProp<MusicParamList>>();
  const onClick = useCallback(
    () =>
      match(item.type)
        .with('track', () => {})
        .with('artist', () => {
          navigation.navigate('Artist', {id: item.id});
        })
        .with('album', () => {
          navigation.navigate('Album', {id: item.id});
        })
        .with('playlist', () => {
          navigation.navigate('Playlist', {id: item.id});
        })
        .exhaustive(),
    [item, navigation],
  );

  return item.type === 'track' ? (
    <TrackListItem
      track={{
        ...item,
        artist: item.subtitle || '',
        album: '',
        duration: 0,
      }}
    />
  ) : (
    <List.Item
      key={item.id}
      title={item.title}
      description={item.subtitle}
      left={props => (
        <Avatar.Image {...props} source={{uri: item.imageSmallUrl}} />
      )}
      onPress={onClick}
    />
  );
}
