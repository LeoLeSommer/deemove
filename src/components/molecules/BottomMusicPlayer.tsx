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
import useMusicPlayerScreen from '../../hooks/musicPlayerScreen';
import usePlayer, {usePlayProgress} from '../../hooks/playQueue';
import useUser from '../../hooks/user';

export default function BottomMusicPlayer() {
  const theme = useTheme();
  const {play, pause, next, hasNextTrack, state, track} = usePlayer();
  const {progress} = usePlayProgress();
  const {showMusicPlayer} = useMusicPlayerScreen();

  const {offlineMode} = useUser();
  const {data: onlineTrack} = useTrackFromLabels(track);
  console.log('online track', onlineTrack);

  const isFavorite = useIsFavoriteTrack(onlineTrack?.id);
  const likeOrUnlike = useLikeOrUnlikeTrack(onlineTrack?.id);

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
                  onPress={() => likeOrUnlike.mutateAsync}
                />
              )}
            </>
          )}
          {hasNextTrack && (
            <IconButton icon="arrow-collapse-right" size={26} onPress={next} />
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
