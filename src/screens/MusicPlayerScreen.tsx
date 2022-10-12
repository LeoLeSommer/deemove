import React, {useMemo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {
  Card,
  IconButton,
  Subheading,
  Title,
  useTheme,
} from 'react-native-paper';
import {SvgUri} from 'react-native-svg';
// @ts-ignore
import AnimatedLinearGradient from 'react-native-animated-linear-gradient';
import mix from 'mix-css-color';
import Slider from '../components/input/Slider';
import usePlayer, {usePlayerProgress} from '../hooks/player';
import {useStoredTrack} from '../hooks/trackStorage';
import useMusicPlayer from '../hooks/musicPlayer';
import useUser from '../hooks/user';
import {useTrackFromLabels} from '../api/track';
import {useIsFavoriteTrack, useLikeOrUnlikeTrack} from '../api/favoriteTracks';

const swapIcon = require('../assets/swap-icon.svg');
const loopIcon = require('../assets/loop-icon.svg');

export default function MusicPlayerScreen() {
  const theme = useTheme();
  const {play, pause, currentTrack, nextTrack, previousTrack, state} =
    usePlayer();
  const {progress, setProgress} = usePlayerProgress();
  const track = useStoredTrack(currentTrack);
  const {hideMusicPlayer} = useMusicPlayer();

  const {offlineMode} = useUser();
  const {data: onlineTrack} = useTrackFromLabels(track);
  const isFavorite = useIsFavoriteTrack(onlineTrack?.id);
  const likeOrUnlike = useLikeOrUnlikeTrack(onlineTrack?.id);

  const backgroundColors = useMemo(
    () => [
      theme.colors.background,
      darkenColor(theme.colors.primary),
      darkenColor(theme.colors.tertiary),
    ],
    [theme],
  );

  const swapIconUri = Image.resolveAssetSource(swapIcon).uri;
  const loopIconUri = Image.resolveAssetSource(loopIcon).uri;

  return (
    <AnimatedLinearGradient customColors={backgroundColors} speed={4000}>
      <View style={styles.container}>
        <IconButton
          icon="arrow-left"
          onPress={hideMusicPlayer}
          style={styles.backButton}
        />
        <View style={styles.coverContainer}>
          <Card style={styles.cover}>
            {track && (
              <Image
                source={{uri: `file://${track.coverPath}`}}
                style={styles.coverImage}
                resizeMode="cover"
              />
            )}
          </Card>
        </View>
        <View style={styles.middleContainer}>
          <View style={styles.contentContainer}>
            <View>
              <Title style={styles.track}>{track?.title}</Title>
              <Subheading>{track?.artist}</Subheading>
            </View>
            {!offlineMode && onlineTrack && (
              <IconButton
                icon={isFavorite ? 'heart' : 'heart-outline'}
                size={26}
                onPress={() => likeOrUnlike.mutateAsync}
              />
            )}
          </View>
          <Slider
            value={progress}
            onSlidingComplete={setProgress}
            maximumValue={1}
            minimumValue={0}
          />
          <View style={styles.controlsContainer}>
            <IconButton
              icon={({color, size}) => (
                <SvgUri
                  style={styles.test}
                  width={size}
                  height={size}
                  color={color}
                  uri={swapIconUri}
                />
              )}
              size={32}
              onPress={() => {}}
            />
            <IconButton
              icon="arrow-collapse-left"
              disabled={previousTrack === null}
              size={32}
              onPress={() => {}}
            />
            {state === 'paused' ? (
              <IconButton
                icon="play"
                mode="contained"
                size={50}
                onPress={play}
              />
            ) : (
              <IconButton
                icon="pause"
                mode="contained"
                size={50}
                onPress={pause}
              />
            )}
            <IconButton
              icon="arrow-collapse-right"
              disabled={nextTrack === null}
              size={32}
              onPress={() => {}}
            />
            <IconButton
              icon={({color, size}) => (
                <SvgUri
                  style={styles.test}
                  width={size}
                  height={size}
                  color={color}
                  uri={loopIconUri}
                />
              )}
              size={32}
              onPress={() => {}}
            />
          </View>
        </View>
      </View>
    </AnimatedLinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
    height: '100%',
    paddingHorizontal: 40,
  },
  backButton: {
    position: 'absolute',
  },
  coverContainer: {
    alignItems: 'center',
    paddingTop: 40,
  },
  cover: {
    flexDirection: 'row',
    padding: 0,
    margin: 0,
    width: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  middleContainer: {
    justifyContent: 'space-between',
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  track: {
    fontWeight: 'bold',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  test: {
    backgroundColor: 'red',
  },
});

function darkenColor(cssColor: string) {
  return mix(cssColor, 'black', 30).hex;
}
