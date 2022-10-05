import React from 'react';
import {View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {useFavoriteTracks} from '../api/user';
import TrackListItem from '../components/molecules/TrackListItem';
import ScrollView from '../components/display/ScrollView';

export default function FavoriteTracksScreen() {
  const {data: tracks, isLoading, fetchNext} = useFavoriteTracks();

  return (
    <View>
      <ScrollView onEndReached={fetchNext}>
        <Spinner visible={isLoading} />
        {tracks.map(track => (
          <TrackListItem key={track.id} track={track} />
        ))}
      </ScrollView>
    </View>
  );
}
