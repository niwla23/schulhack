'use strict';
import { Text, StyleSheet, ViewStyle, TextStyle, Pressable } from 'react-native';
import React from 'react';
import { useTheme } from '../theme/themeprovider';


const Button = ({onPress, text}) => {
    const { colors, isDark } = useTheme();

    interface Style {
        text: TextStyle;
        background: ViewStyle
    }
    const styles = StyleSheet.create<Style>({
        text: {
            color: colors.background,
            textAlign: "center",
            fontWeight: "bold",
            letterSpacing: 2,

        },
        background: {
            backgroundColor: colors.primary,
            padding: 8,
            borderRadius: 8,
        
        }
    });


    return (
        <Pressable style={styles.background} onPress={onPress}>
            <Text style={styles.text}>
                {text.toUpperCase()}
            </Text>
        </Pressable>
    );


};

export default Button
