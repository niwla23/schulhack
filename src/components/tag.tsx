'use strict';
import { Text, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import React from 'react';
import { useTheme } from '../theme/themeprovider';


export const Tag = (props) => {
    const { colors, isDark } = useTheme();

    interface Style {
        tagContainer: ViewStyle;
        tagWrapper: ViewStyle;
        tagContent: TextStyle;
        tagHeader: TextStyle;
    }
    const styles = StyleSheet.create<Style>({
        tagContainer: {

        },
        tagWrapper: {
            paddingRight: 8,
            paddingBottom: 8,

        },
        tagContent: {
            backgroundColor: colors.secondary,
            padding: 8,
            borderTopRightRadius: 15,
            borderBottomRightRadius: 15,
            color: "#000"
        },
        tagHeader: {
            backgroundColor: colors.primary,
            padding: 8,
            borderTopLeftRadius: 15,
            borderBottomLeftRadius: 15,
            color: "#000"
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
        return (<></>)
    }

};

