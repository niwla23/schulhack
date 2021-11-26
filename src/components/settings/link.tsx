'use strict';
import { Text, Pressable, TextStyle, ViewStyle, StyleSheet, View } from 'react-native';
import React from 'react';
import { useTheme } from '../../theme/themeprovider';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


export const LinkSetting = (props) => {
    const { colors, isDark } = useTheme();
    interface Style {
        container: ViewStyle;
        title: TextStyle;
        currentValue: TextStyle;
    }
    const styles = StyleSheet.create<Style>({
        container: {
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
                <View style={{ display: "flex", flexDirection: "row" }}>
                    <View style={{ width: 70, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <View style={{ width: 70, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                            <FontAwesome5 style={{ color: colors.text, fontSize: 24 }} name={props.icon_name}></FontAwesome5>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.title}>{props.title}</Text>
                        <Text style={styles.currentValue}>{props.value}</Text>
                    </View>
                </View>
            </Pressable>
        </>
    );
};

