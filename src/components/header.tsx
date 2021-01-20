'use strict';
import { Text, StyleSheet, View, ViewStyle, TextStyle, Pressable, Alert } from 'react-native';
import React from 'react';
import { useTheme } from '../theme/themeprovider';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export const Header = (props) => {
    const { colors, isDark } = useTheme();

    interface Style {
        menuContainer: ViewStyle;
        menu: ViewStyle;
        title: TextStyle;
    }
    const styles = StyleSheet.create<Style>({
        menuContainer: {
            color: colors.primary,
            margin: 20,
            position: "absolute",
            zIndex: 99,
        },
        menu: { color: colors.primary, fontSize: 24},
        title: {
            color: colors.text,
            fontSize: 30,
            textAlign: "center",
            padding: 20,
            paddingTop: 15

        }
    });

    return (
        <View>
            <Pressable
                style={styles.menuContainer}
                onPress={() => {
                    props.openDrawer()
                }}
            >
                <FontAwesome5 style={styles.menu} name='bars' light />
            </Pressable>

            <Text style={styles.title}>{props.title}</Text>

        </View>

    );


};

