import React, {View, StyleSheet} from 'react-native';
import {
  Caption,
  IconButton,
  Paragraph,
  ProgressBar,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {
  useIsFavoriteTrack,
  useLikeOrUnlikeTrack,
} from '../../api/favoriteTracks';
import {useTrackFromLabels} from '../../api/track';
import useMusicPlayer from '../../hooks/musicPlayer';
import usePlayer, {usePlayerProgress} from '../../hooks/player';
import {useStoredTrack} from '../../hooks/trackStorage';
import useUser from '../../hooks/user';

export default function BottomMusicPlayer() {
  const theme = useTheme();
  const {play, pause, currentTrack, nextTrack, state} = usePlayer();
  const {progress} = usePlayerProgress();
  const track = useStoredTrack(currentTrack);
  const {showMusicPlayer} = useMusicPlayer();

  const {offlineMode} = useUser();
  const {data: onlineTrack} = useTrackFromLabels(track);
  const isFavorite = useIsFavoriteTrack(onlineTrack?.id);
  const likeOrUnlike = useLikeOrUnlikeTrack(onlineTrack?.id);

  console.log('onlineTrack', track, onlineTrack);

  if (state === 'stopped') {
    return <></>;
  }

  const containerStyle = {
    backgroundColor: theme.colors.elevation.level1,
    width: '100%',
  };

  return (
    <TouchableRipple onPress={showMusicPlayer} style={containerStyle}>
      <View>
        <View style={styles.content}>
          {state === 'paused' ? (
            <IconButton icon="play" size={26} onPress={play} />
          ) : (
            <IconButton icon="pause" size={26} onPress={pause} />
          )}
          {track && (
            <>
              <View style={styles.text}>
                <Paragraph>{track.title}</Paragraph>
                <Caption>{track.artist}</Caption>
              </View>
              {!offlineMode && onlineTrack && (
                <IconButton
                  icon={isFavorite ? 'heart' : 'heart-outline'}
                  size={26}
                  onPress={likeOrUnlike.mutateAsync}
                />
              )}
            </>
          )}
          {nextTrack && (
            <IconButton
              icon="arrow-collapse-right"
              size={26}
              onPress={() => {}}
            />
          )}
        </View>
        <ProgressBar progress={progress} />
      </View>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    flex: 1,
  },
});
