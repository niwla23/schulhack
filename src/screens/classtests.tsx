"use strict"

import React from 'react';
import { Button, Text, View, StyleSheet, ViewStyle } from 'react-native';
import type { Type } from "react-native"
import { useTheme } from '../theme/themeprovider';

export default function ClassTestsScreen({ navigation }) {
    const { colors, isDark } = useTheme();

    interface Style {
        background: ViewStyle;
    }
    const styles = StyleSheet.create<Style>({
        background: {
            backgroundColor: colors.background,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }
    })

    return (
        <View style={styles.background}>
            <Text>{isDark}</Text>
            <Button
                onPress={() => navigation.navigate('Tasks')}
                title="Arbeiten"
            />
        </View>
    );
}