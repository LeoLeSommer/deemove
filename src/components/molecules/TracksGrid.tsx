import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Avatar, List, useTheme} from 'react-native-paper';
import {chunk} from 'lodash';
import parse from 'parse-css-color';
import style from '../../constants/style';
import {Track} from '../../models/Track';

export type TracksGridProps = {
  tracks: Track[];
};

export default function TracksGrid({tracks}: TracksGridProps) {
  const theme = useTheme();
  const backgroundColor = parse(theme.colors.onSurface);

  return (
    <ScrollView
      style={styles.container}
      horizontal
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      {chunk(tracks || [], 3).map((elems, index) => (
        <View key={index}>
          {elems.map(elem => (
            <List.Item
              key={elem.id}
              style={{
                ...styles.track,
                backgroundColor: `rgba(${backgroundColor?.values.join(
                  ',',
                )}, 0.1)`,
              }}
              left={props => (
                <Avatar.Image {...props} source={{uri: elem.imageMediumUrl}} />
              )}
              title={elem.title}
              description={elem.artist}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 260,
  },
  track: {
    flexDirection: 'row',
    elevation: 0,
    margin: style.margeXXS,
  },
});
