"use strict"

import React from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../theme/themeprovider';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export function ListError({ props }) {
    const { colors, isDark } = useTheme();
    interface Style {
        noItemsFoundText: TextStyle;
        errorIcon: ViewStyle;
    }
    const styles = StyleSheet.create<Style>({
        noItemsFoundText: {
            paddingTop: 32,
            textAlign: "center",
            color: colors.text
        },
        errorIcon: {
            color: colors.primary,
            fontSize: 100,
            textAlign: 'center',
            paddingTop: 100
        }
    })
    return (
        <View>
            <FontAwesome5 style={styles.errorIcon} name={props.icon} light />
            <Text style={styles.noItemsFoundText}>{props.error}</Text>
        </View>
    )
}

export default ListError