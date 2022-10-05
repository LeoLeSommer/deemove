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
import AnimatedLinearGradient from 'react-native-animated-linear-gradient';
import mix from 'mix-css-color';
import Slider from '../components/input/Slider';
import usePlayer, {usePlayerProgress} from '../hooks/player';
import {useStoredTrack} from '../hooks/trackStorage';
import useMusicPlayer from '../hooks/musicPlayer';

const logo = require('../assets/cover.jpg');
const swapIcon = require('../assets/swap-icon.svg');
const loopIcon = require('../assets/loop-icon.svg');

export default function MusicPlayerScreen() {
  const theme = useTheme();
  const {play, pause, currentTrack, nextTrack, previousTrack, state} =
    usePlayer();
  const {progress, setProgress} = usePlayerProgress();
  const track = useStoredTrack(currentTrack);
  const {hideMusicPlayer} = useMusicPlayer();

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
          icon="close"
          onPress={hideMusicPlayer}
          style={styles.closeButton}
        />
        <View style={styles.coverContainer}>
          <Card style={styles.cover}>
            <Image source={logo} style={styles.coverImage} resizeMode="cover" />
          </Card>
        </View>
        <View style={styles.contentContainer}>
          <View>
            <Title style={styles.track}>{track?.title}</Title>
            <Subheading>{track?.artist}</Subheading>
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
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
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
  contentContainer: {
    justifyContent: 'space-between',
    flex: 1,
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
