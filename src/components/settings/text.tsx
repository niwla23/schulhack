'use strict';
import { Text, Pressable, View, Alert, TextInput, Modal, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../theme/themeprovider';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export const TextSetting = (props) => {
    const { colors, isDark } = useTheme();
    interface Style {
        container: ViewStyle;
        title: TextStyle;
        currentValue: TextStyle;
        centeredView: ViewStyle;
        modalView: ViewStyle;
        input: ViewStyle;
        actionsContainer: ViewStyle;
        actions: ViewStyle;
        modalText: TextStyle;
        openButton: ViewStyle;
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
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 22
        },
        modalView: {
            margin: 20,
            padding: 20,
            paddingBottom: 15,
            backgroundColor: colors.background2,
            borderRadius: 10,
            width: "90%",
            alignItems: "flex-start",
        },
        input: {
            width: "100%",
            color: colors.text,
            marginBottom: 5,
        },
        actionsContainer: {
            alignItems: "flex-end",
            width: "100%"
        },
        actions: {
            flexDirection: "row",
        },
        modalText: {
            color: colors.text,
            marginBottom: 15,
            textAlign: "center"
        },
        openButton: {
            color: colors.primary,
            paddingLeft: 10
        }

    })

    const [modalVisible, setModalVisible] = useState(false);
    const [value, setValue] = useState(null)
    const [tempValue, setTempValue] = useState(null)


    useEffect(() => {
        AsyncStorage.getItem(props.setting_name).then(read_value => {
            setValue(read_value)
            setTempValue(read_value)
        })
    }, []);


    return (
        <>
            {/* kk */}
            <Pressable
                android_ripple={{ color: colors.text2 }}
                style={styles.container}
                onPress={() => {
                    setModalVisible(true)
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
                        <Text style={styles.currentValue}>{value}</Text>
                    </View>
                </View>
            </Pressable>
        </>
    );
};

