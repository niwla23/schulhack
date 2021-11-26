'use strict';

import { Text, Pressable, View, StyleSheet, TextInput, Modal, TextStyle, ViewStyle } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../theme/themeprovider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


export const SelectSetting = (props) => {
    const { colors, isDark } = useTheme();

    interface Style {
        container: ViewStyle;
        title: TextStyle;
        currentValue: TextStyle;
        center: ViewStyle;
        modal: ViewStyle;
        item: ViewStyle;
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
        center: {

            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 22,
        },
        modal: {
            backgroundColor: colors.background2,
            width: "80%"
        },
        item: {
            color: colors.text,
            padding: 20
        }

    })
    const [modalVisible, setModalVisible] = useState(false);
    const [newValue, setNewValue] = useState("")

    useEffect(() => {
        AsyncStorage.getItem(props.setting_name).then(read_value => {
            if (read_value) {
                setNewValue(read_value)
            }
        })
    }, []);

    return (
        <>
            <Modal

                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.center}>
                    <View style={styles.modal}>
                        {Object.keys(props.options).map((option, index) =>
                            <Pressable
                                key={option + index}
                                android_ripple={{ color: colors.text2 }}
                                onPress={() => {
                                    setModalVisible(false)
                                    setNewValue(option)
                                    AsyncStorage.setItem(props.setting_name, option)
                                    if (props.afterSelect) {
                                        props.afterSelect(props.setting_name)
                                    }
                                }}
                            >
                                <Text style={styles.item}>{props.options[option]}</Text>
                            </Pressable>
                        )}
                    </View>
                </View>

            </Modal>
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
                <Text style={styles.currentValue}>{props.options[newValue]}</Text>
                    </View>
                </View>


            </Pressable>
        </>
    );
};


