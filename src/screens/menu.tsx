"use strict"

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { Button, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/themeprovider';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { color } from 'react-native-reanimated';


export default function MenuScreen({ navigation }) {
    const { colors, isDark } = useTheme()

    useEffect(() => {
        navigation.openDrawer()
        return (
            function cleanup() {
                navigation.closeDrawer()
            }
        )
    })

    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.background
        }}>
            <Button title="Hier Drücken, falls das Menü nicht da ist..." onPress={() => navigation.openDrawer()}></Button>
        </View>

    );
}