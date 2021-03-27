'use strict';

import { Text, StyleSheet, View, ViewStyle, TextStyle, Task, Pressable, Button } from 'react-native';
import React from 'react';
import { Tag } from './tag'
import { useTheme } from '../theme/themeprovider';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';


export const UpdateOverlay = ({ onCancel, onAccept, releaseNotes, versionName }) => {
    const { colors, isDark } = useTheme();

    interface Style {
        screen: ViewStyle;
        title: TextStyle;
        releaseNotes: ViewStyle;
        updateButton: ViewStyle;
        updateButtonText: TextStyle;
        cancelText: TextStyle;
    }
    const styles = StyleSheet.create<Style>({
        screen: {
            position: "absolute",
            top: 0,
            width: "100%",
            height: "100%",
            backgroundColor: colors.background,
            justifyContent: "center",
            paddingRight: 60,
            paddingLeft: 60
        },
        title: {
            color: colors.text,
            fontSize: 30,
            textAlign: "center",
        },
        releaseNotes: {
            color: colors.text,
            fontFamily: "Monospace",
            textAlign: "center"
        },
        updateButton: {
            backgroundColor: colors.text,
            marginTop: 20,
            borderRadius: 8
        },
        updateButtonText: {
            color: colors.background,
            textAlign: "center",
            padding: 10
        },
        cancelText: {
            textAlign: "center",
            color: colors.text,
            marginTop: 10

        }
    });


    return (
        <View style={styles.screen}>
            <Text style={styles.title}>Update verfügbar</Text>
            {releaseNotes.map((releaseNote, index) =>
                <Text key={index} style={styles.releaseNotes}>- {releaseNote}</Text>
            )}

            <Pressable
                style={styles.updateButton}
                android_ripple={{ color: colors.background2, borderless: false }}
                onPress={onAccept}
            >
                <Text style={styles.updateButtonText}>DOWNLOAD {versionName}</Text>
            </Pressable>
            <Pressable onPress={onCancel}>
                <Text style={styles.cancelText}>Mach ich später</Text>
            </Pressable>

        </View>
    );
}



export default UpdateOverlay;
