'use strict';
import { Text, Pressable, View, TextInput, Modal, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../theme/themeprovider';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export const TagsSetting = (props) => {
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
    const [value, setValue] = useState([])
    const [tempValue, setTempValue] = useState("")


    useEffect(() => {
        AsyncStorage.getItem(props.setting_name).then(read_value => {
            try {
                setValue(JSON.parse(read_value) || [])
            } catch {}
            try {
                setTempValue(JSON.parse(read_value).join(" ") || "")
            } catch {}
            
        })
    }, []);


    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{props.description}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={props.placeholder}
                            value={tempValue}
                            onChangeText={text => setTempValue(text)}
                            placeholderTextColor={colors.text2}

                            underlineColorAndroid={colors.text}
                        />
                        <View style={styles.actionsContainer}>
                            <View style={styles.actions}>
                                <Pressable
                                    onPress={() => {
                                        setTempValue(value.join(" "))
                                        setModalVisible(!modalVisible);
                                    }}
                                    style={styles.openButton}
                                >
                                    <Text style={styles.openButton}>
                                        Abbrechen
                                    </Text>
                                </Pressable>
                                <Pressable
                                    style={styles.openButton}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                        setValue(tempValue.toString().split(" "))
                                        if (tempValue != "") {
                                            AsyncStorage.setItem(props.setting_name, JSON.stringify(tempValue.split(" ")))
                                        } else {
                                            AsyncStorage.removeItem(props.setting_name)
                                        }
                                    }}
                                >
                                    <Text style={styles.openButton}>
                                        Speichern
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
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
                <Text style={styles.currentValue}>{value.join(", ")}</Text>
                    </View>
                </View>
            </Pressable>
        </>
    );
};

