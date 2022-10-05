import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {useTheme} from 'react-native-paper';

export default function PlayerScreen() {
  const theme = useTheme();

  const containerStyle = {
    backgroundColor: theme.colors.background,
    width: '100%',
    height: '100%',
  };

  return (
    <SafeAreaView style={containerStyle}>
      <View />
    </SafeAreaView>
  );
}
