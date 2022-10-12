import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Avatar,
  IconButton,
  List,
  useTheme,
} from 'react-native-paper';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import {useNavigation} from '@react-navigation/native';
import locales from '../locales';
import useDownloadQueue from '../hooks/downloadQueue';
import {DownloadQueueElem} from '../hooks/trackStorage';
import {useTrack} from '../api/track';

export default function DownloadQueueScreen() {
  const theme = useTheme();
  const {downloadQueue} = useDownloadQueue();
  const {canGoBack, goBack} = useNavigation();

  const containerStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
    width: '100%',
    height: '100%',
  };

  return (
    <SafeAreaView style={containerStyle}>
      <Appbar.Header>
        {canGoBack() && <Appbar.BackAction onPress={goBack} />}
        <Appbar.Content title={locales.settings.downloadQueue} />
      </Appbar.Header>
      <DraggableFlatList
        data={downloadQueue}
        onDragEnd={({}) => {}}
        keyExtractor={item => item.trackId}
        renderItem={props => <DownloadQueueItem {...props} />}
      />
    </SafeAreaView>
  );
}

export type DownloadQueueItemProps = {
  item: DownloadQueueElem;
  drag: () => void;
  isActive: boolean;
};

export function DownloadQueueItem({item, drag}: DownloadQueueItemProps) {
  const {data: track} = useTrack(item.trackId);
  const {removeFromDownloadQueue} = useDownloadQueue();

  return (
    <ScaleDecorator>
      <List.Item
        key={track?.id}
        title={track?.title}
        description={track?.artist}
        left={props => (
          <Avatar.Image
            {...props}
            size={48}
            source={{uri: track?.imageSmallUrl}}
          />
        )}
        right={props =>
          item.status === 'pending' ? (
            <View style={styles.actionsContainer}>
              <IconButton
                {...props}
                icon="delete"
                size={26}
                onPress={() => removeFromDownloadQueue(item.trackId)}
              />
              <IconButton
                {...props}
                icon="drag"
                size={26}
                onLongPress={drag}
                onPress={() => {}}
              />
            </View>
          ) : (
            <ActivityIndicator animating={true} />
          )
        }
      />
    </ScaleDecorator>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
  },
});
