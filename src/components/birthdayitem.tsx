'use strict';

import {Text, StyleSheet, View, ViewStyle, TextStyle} from 'react-native';
import React from 'react';
import {useTheme} from '../theme/themeprovider';
import {Birthday} from '../iservscrapping/types';

export const BirthdayItem = (props: {data: Birthday}) => {
  const {colors, isDark} = useTheme();

  interface Style {
    itemContainer: ViewStyle;
    itemTitle: TextStyle;
    itemContent: TextStyle;
  }

  let highlight = props.data.when === 'heute';

  const styles = StyleSheet.create<Style>({
    itemContainer: {
      backgroundColor: highlight ? colors.primary : colors.background2,
      padding: 20,
      borderRadius: 8,
      margin: 10,
      marginBottom: 0,
    },
    itemTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
    },
    itemContent: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
  });

  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{props.data.name}</Text>
      <Text style={styles.itemContent}>
        wird {props.data.when} {props.data.becomes}
      </Text>
    </View>
  );
};

export default BirthdayItem;
