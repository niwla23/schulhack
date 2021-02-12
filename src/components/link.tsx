'use strict';
import { Text, StyleSheet, View, ViewStyle, TextStyle, Linking } from 'react-native';
import React from 'react';
import { useTheme } from '../theme/themeprovider';


export const Link = (props) => {
    const { colors, isDark } = useTheme();

    interface Style {
        link: TextStyle;
    }
    const styles = StyleSheet.create<Style>({
        link: {
            color: colors.link,
            textDecorationLine: "underline"
        }
    });


    return (
        <Text style={styles.link} onPress={() => { Linking.openURL(props.url) }}>{props.text}</Text>
    );


};

