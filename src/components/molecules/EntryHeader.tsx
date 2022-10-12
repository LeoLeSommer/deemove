import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import {Text, Title, Button, IconButton} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import locales from '../../locales';
import style from '../../constants/style';
import {useNavigation} from '@react-navigation/native';

export type EntryHeaderProps = {
  title: string;
  subtitle?: string;
  imageUrl: string;
  isFavorite?: boolean;
  likeOrUnlike?: () => Promise<void>;
  onListen: () => void;
};

export default function EntryHeader({
  title,
  subtitle,
  imageUrl,
  isFavorite,
  likeOrUnlike,
  onListen,
}: EntryHeaderProps) {
  const {canGoBack, goBack} = useNavigation();

  return (
    <ImageBackground style={styles.container} source={{uri: imageUrl}}>
      <LinearGradient
        locations={[0, 0.4, 0.6, 1]}
        colors={['#000000', '#000000AA', '#00000088', '#00000000']}
        style={styles.textContainer}>
        <Title>{title}</Title>
        {subtitle && <Text>{subtitle}</Text>}
      </LinearGradient>
      <View style={styles.buttonContainer}>
        <View />
        <Button onPress={onListen} mode="contained">
          {locales.common.listen}
        </Button>
      </View>
      {likeOrUnlike && (
        <IconButton
          icon={isFavorite ? 'heart' : 'heart-outline'}
          mode="contained"
          onPress={likeOrUnlike}
          style={styles.likeButton}
        />
      )}
      {canGoBack() && (
        <IconButton
          icon="arrow-left"
          onPress={goBack}
          size={30}
          style={styles.backButton}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 20,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: style.margeMedium,
    paddingBottom: style.margeLarge,
  },
  buttonContainer: {
    position: 'absolute',
    width: '100%',
    bottom: -20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  likeButton: {
    position: 'absolute',
    bottom: -24,
    right: 10,
  },
  backButton: {
    position: 'absolute',
  },
});
