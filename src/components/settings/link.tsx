'use strict';
import { Text, Pressable, TextStyle, ViewStyle, StyleSheet } from 'react-native';
import React from 'react';
import { useTheme } from '../../theme/themeprovider';

export const LinkSetting = (props) => {
    const { colors, isDark } = useTheme();
    interface Style {
        container: ViewStyle;
        title: TextStyle;
        currentValue: TextStyle;
    }
    const styles = StyleSheet.create<Style>({
        container: {
            paddingLeft: 70,
            paddingBottom: 10,
            paddingTop: 10,
        },
        title: {
            color: colors.text,
            fontSize: 16
        },
        currentValue: {
            color: colors.text2
        },

    })
    return (
        <>
            <Pressable
                android_ripple={{ color: colors.text2 }}
                style={styles.container}
                onPress={() => {
                    props.onPress()
                }}
            >
                <Text style={styles.title}>{props.title}</Text>
                <Text style={styles.currentValue}>{props.value}</Text>
            </Pressable>
        </>
    );
};

