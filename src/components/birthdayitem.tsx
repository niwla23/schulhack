'use strict';

import { Text, StyleSheet, View, ViewStyle, TextStyle, Task, Pressable } from 'react-native';
import React from 'react';
import { Tag } from './tag'
import { useTheme } from '../theme/themeprovider';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export const BirthdayItem = (props) => {
    const { colors, isDark } = useTheme();

    interface Style {
        itemContainer: ViewStyle;
        itemTitle: TextStyle;
        itemContent: TextStyle;
    }
    const styles = StyleSheet.create<Style>({
        itemContainer: {
            backgroundColor: props.highlighted ? colors.primary : colors.background2,
            padding: 20,
            margin: 8
        },
        itemTitle: {
            fontSize: 20,
            fontWeight: '600',
            color: "#fff",
        },
        itemContent: {
            fontSize: 16,
            fontWeight: '600',
            color: "#fff",
        },
    });

    return (
        <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{props.name}</Text>
            <Text style={styles.itemContent}>{props.date}</Text>
        </View>
    );
}



export default BirthdayItem;
