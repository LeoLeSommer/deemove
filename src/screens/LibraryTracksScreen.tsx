import React from 'react';
import {View} from 'react-native';
import TrackListItem from '../components/molecules/TrackListItem';
import ScrollView from '../components/display/ScrollView';
import {useStoredTracks} from '../hooks/trackStorage';

export default function LibraryTracksScreen() {
  const tracks = useStoredTracks();

  return (
    <View>
      <ScrollView>
        {tracks.map(track => (
          <TrackListItem key={track.id} track={track} />
        ))}
      </ScrollView>
    </View>
  );
}
