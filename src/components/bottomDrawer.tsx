'use strict';
import {
  Text,
  View,
  StyleSheet,
  ViewStyle,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect} from 'react';
import {useTheme} from '../theme/themeprovider';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  Easing,
  withTiming,
} from 'react-native-reanimated';

interface DrawerItem {
  text: string;
  key: string;
}

interface OnSelectFunction {
  (selected: string): void;
}

interface BottomDrawerProps {
  visible: boolean;
  items: DrawerItem[];
  onSelect: OnSelectFunction;
}

export const BottomDrawer = (props: BottomDrawerProps) => {
  const {colors, isDark} = useTheme();
  const {height, width} = useWindowDimensions();

  interface Style {
    container: ViewStyle;
    item: ViewStyle;
    wrapper: ViewStyle;
  }
  const styles = StyleSheet.create<Style>({
    wrapper: {
      position: 'absolute',
      height: height,
      width: width,
      backgroundColor: colors.error,
    },
    container: {
      backgroundColor: colors.background2,
      width: width,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      borderRadius: 32,
      padding: 32,
      minHeight: 150,
    },
    item: {
      paddingBottom: 32,
    },
  });

  const offset = useSharedValue(200);

  useEffect(() => {
    offset.value = props.visible ? 0 : 200;
  }, [offset.value, props.visible]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(offset.value, {
            easing: Easing.out(Easing.exp),
          }),
        },
      ],
    };
  });

  let itemsRendered: Element[] = [];
  props.items.forEach((element) => {
    itemsRendered.push(
      <Pressable
        style={styles.item}
        key={element.key}
        onPress={() => {
          props.onSelect(element.key);
        }}>
        <Text style={{color: colors.text}}>{element.text}</Text>
      </Pressable>,
    );
  });

  return (
    <Animated.View style={[styles.container, animatedStyles]}>
      {itemsRendered}
    </Animated.View>
  );
};
