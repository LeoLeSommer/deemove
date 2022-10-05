import React, {useState} from 'react';
import {
  ScrollView as RNScrollView,
  ScrollViewProps as RNScrollViewProps,
} from 'react-native';

type Vector2d = {
  x: number;
  y: number;
};

type Size2d = {
  width: number;
  height: number;
};

const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: {
  layoutMeasurement: Size2d;
  contentOffset: Vector2d;
  contentSize: Size2d;
}) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const isCloseToRight = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: {
  layoutMeasurement: Size2d;
  contentOffset: Vector2d;
  contentSize: Size2d;
}) => {
  const paddingToRight = 20;
  return (
    layoutMeasurement.width + contentOffset.x >=
    contentSize.width - paddingToRight
  );
};

export type ScrollViewProps = {
  onEndReached?: () => void;
} & RNScrollViewProps;

export default function ScrollView({
  onEndReached,
  horizontal,
  ...props
}: ScrollViewProps) {
  const [wasCloseToEnd, setWasCloseToEnd] = useState(false);

  if (onEndReached && !horizontal) {
    return (
      <RNScrollView
        {...props}
        onScroll={({nativeEvent}: any) => {
          if (isCloseToBottom(nativeEvent)) {
            if (!wasCloseToEnd) {
              onEndReached();
            }

            setWasCloseToEnd(true);
          } else {
            setWasCloseToEnd(false);
          }
        }}
        scrollEventThrottle={400}
      />
    );
  } else if (onEndReached && horizontal) {
    return (
      <RNScrollView
        {...props}
        onScroll={({nativeEvent}: any) => {
          if (isCloseToRight(nativeEvent)) {
            if (!wasCloseToEnd) {
              onEndReached();
            }

            setWasCloseToEnd(true);
          } else {
            setWasCloseToEnd(false);
          }
        }}
        scrollEventThrottle={400}
      />
    );
  } else {
    return <RNScrollView {...props} />;
  }
}
