import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  IconButton,
  List,
  Menu,
} from 'react-native-paper';
import locales from '../../locales';
import {useTrackStatus} from '../../api/stored';
import {useLikeOrUnlikeTrack} from '../../api/track';
import useDownloadQueue from '../../hooks/downloadQueue';
import {useIsFavoriteTrack} from '../../hooks/favorites';
import usePlayer from '../../hooks/player';
import {Track} from '../../models/Track';
import useUser from '../../hooks/user';

export type TrackListItemProps = {
  track: Track;
};

export default function TrackListItem({track}: TrackListItemProps) {
  const {offlineMode} = useUser();
  const isFavorite = useIsFavoriteTrack(track.id);
  const status = useTrackStatus(track);
  const likeOrUnlike = useLikeOrUnlikeTrack(track.id);
  const {playTrack, addTrackToQueue, pause, currentTrack, state} = usePlayer();
  const [menuVisible, setMenuVisible] = useState(false);
  const {addToDownloadQueue, isInDownloadQueue} = useDownloadQueue();

  const isPlaying = useMemo(
    () => currentTrack === track.id && state === 'playing',
    [currentTrack, track.id, state],
  );

  const play = useCallback(() => {
    if (status === 'downloaded' && !isPlaying) {
      playTrack(track.id);
    }
  }, [playTrack, track.id, status, isPlaying]);

  const addToQueue = useCallback(() => {
    if (status === 'downloaded' && !isPlaying) {
      addTrackToQueue(track.id);
    }
    setMenuVisible(false);
  }, [addTrackToQueue, track.id, status, isPlaying]);

  // Hide menu for not downloaded tracks
  useEffect(() => {
    if (status !== 'downloaded') {
      setMenuVisible(false);
    }
  }, [status]);

  const showMenu = useCallback(() => {
    if (status === 'downloaded') {
      setMenuVisible(true);
    }
  }, [status]);

  const hideMenu = useCallback(() => {
    setMenuVisible(false);
  }, []);

  const shouldDisplayLoadingIndicator =
    ['downloading', 'loading-filesystem'].includes(status) ||
    isInDownloadQueue(track.id);

  return (
    <Menu
      visible={menuVisible}
      onDismiss={hideMenu}
      anchor={
        <List.Item
          key={track.id}
          title={track.title}
          description={track.artist}
          onPress={play}
          onLongPress={showMenu}
          left={props => (
            <Avatar.Image
              {...props}
              size={48}
              source={{uri: track.imageSmallUrl}}
            />
          )}
          right={props => (
            <View style={styles.actionsContainer}>
              {!shouldDisplayLoadingIndicator &&
                !offlineMode &&
                status === 'not-downloaded' && (
                  <IconButton
                    {...props}
                    icon="download"
                    size={26}
                    onPress={() => addToDownloadQueue(track.id)}
                  />
                )}
              {shouldDisplayLoadingIndicator && (
                <ActivityIndicator animating={true} />
              )}
              {status === 'downloaded' && !isPlaying && (
                <IconButton {...props} icon="play" size={26} onPress={play} />
              )}
              {status === 'downloaded' && isPlaying && (
                <IconButton {...props} icon="pause" size={26} onPress={pause} />
              )}
              {!offlineMode && (
                <IconButton
                  {...props}
                  icon={isFavorite ? 'heart' : 'heart-outline'}
                  size={26}
                  onPress={likeOrUnlike}
                />
              )}
            </View>
          )}
        />
      }>
      <Menu.Item onPress={addToQueue} title={locales.track.addToTrackQueue} />
      <Menu.Item onPress={() => {}} title={locales.track.deleteTrack} />
    </Menu>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
  },
});
