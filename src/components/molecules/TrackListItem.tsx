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
import {getTrackFilepath} from '../../api/download';
import useDownloadQueue from '../../hooks/downloadQueue';
import usePlayer from '../../hooks/player';
import {Track} from '../../models/Track';
import useUser from '../../hooks/user';
import useSettings from '../../hooks/settings';
import {
  useIsFavoriteTrack,
  useLikeOrUnlikeTrack,
} from '../../api/favoriteTracks';

export type TrackListItemProps = {
  track: Track;
};

export default function TrackListItem({track}: TrackListItemProps) {
  const {offlineMode} = useUser();
  const status = useTrackStatus(track);
  const {playTrack, addTrackToQueue, pause, currentTrack, state} = usePlayer();
  const [menuVisible, setMenuVisible] = useState(false);
  const {addToDownloadQueue, isInDownloadQueue} = useDownloadQueue();
  const {downloadDirectory} = useSettings();
  const filepath = getTrackFilepath(downloadDirectory, track);
  const isFavorite = useIsFavoriteTrack(track.id);
  const likeOrUnlike = useLikeOrUnlikeTrack(track.id);

  const isPlaying = useMemo(
    () => currentTrack === track.id && state === 'playing',
    [currentTrack, track.id, state],
  );

  const play = useCallback(() => {
    if (filepath && status === 'downloaded' && !isPlaying) {
      playTrack(filepath);
    }
  }, [playTrack, filepath, status, isPlaying]);

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
                  onPress={likeOrUnlike.mutateAsync}
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
