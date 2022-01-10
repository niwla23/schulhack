'use strict';

import {Text, StyleSheet, View, ViewStyle, TextStyle} from 'react-native';
import React from 'react';
import {useTheme} from '../theme/themeprovider';
import {Classtest} from '../iservscrapping/types';
import {Tag} from './tag';

export const ClasstestItem = (props: {data: Classtest}) => {
  const {colors, isDark} = useTheme();

  interface Style {
    itemContainer: ViewStyle;
    itemTitle: TextStyle;
    tags: ViewStyle;
  }

  const styles = StyleSheet.create<Style>({
    itemContainer: {
      backgroundColor: colors.background2,
      padding: 20,
      borderRadius: 8,
      margin: 10,
      marginBottom: 0,
    },
    itemTitle: {
      fontSize: 20,
      color: colors.text,
      marginBottom: 8,
    },
    tags: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  });

  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{props.data.title}</Text>
      <View style={styles.tags}>
        <Tag header={'Datum'} content={props.data.date} />
        <Tag header={'Art'} content={props.data.kind} />
      </View>
    </View>
  );
};

export default ClasstestItem;
