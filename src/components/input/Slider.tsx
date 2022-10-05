import React from 'react';
import RNSlider, {
  SliderProps as RNSliderProps,
} from '@react-native-community/slider';
import {useTheme} from 'react-native-paper';

export type SliderProps = RNSliderProps;

export default function Slider({...props}: SliderProps) {
  const theme = useTheme();

  return (
    <RNSlider
      minimumTrackTintColor={theme.colors.primary}
      thumbTintColor={theme.colors.primary}
      {...props}
    />
  );
}
