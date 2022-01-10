'use strict';
import {Text, StyleSheet, View, ViewStyle, TextStyle} from 'react-native';
import React from 'react';
import {useTheme} from '../theme/themeprovider';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import HTML from 'react-native-render-html';

function getTagContent(text) {
  const {colors, isDark} = useTheme();

  if (typeof text === 'string' || text instanceof String) {
    return (
      <HTML
        ignoredStyles={['color']}
        baseFontStyle={{color: '#000'}}
        source={{html: text.toString()}}
      />
    );
  }
  return text;
}

export const Tag = (props) => {
  const {colors, isDark} = useTheme();

  interface Style {
    tagContainer: ViewStyle;
    tagWrapper: ViewStyle;
    tagContent: TextStyle;
    tagHeader: TextStyle;
  }
  const styles = StyleSheet.create<Style>({
    tagContainer: {},
    tagWrapper: {
      paddingRight: 8,
      paddingBottom: 8,
    },
    tagContent: {
      backgroundColor: colors.secondary,
      padding: 8,
      borderTopRightRadius: 10,
      fontSize: 13.5,
      borderBottomRightRadius: 10,
      color: '#000',
    },
    tagHeader: {
      backgroundColor: colors.primary,
      padding: 8,
      fontSize: 13.5,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      color: '#000',
    },
  });

  if (props.content && props.header) {
    return (
      <View style={styles.tagWrapper}>
        <Text>
          <View style={styles.tagContainer}>
            <Text style={styles.tagHeader}>{props.header}</Text>
          </View>
          <View style={styles.tagContainer}>
            <Text style={styles.tagContent}>{props.content}</Text>
          </View>
        </Text>
      </View>
    );
  } else {
    return <></>;
  }
};
