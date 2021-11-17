'use strict';
import { Text, StyleSheet, View, ViewStyle, TextStyle, Modal, Pressable, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import React, { useState } from 'react';
import { useTheme } from '../theme/themeprovider';


export const TextInputModal = ({onSubmit, onCancel, open, description, placeholder}) => {
    const { colors, isDark } = useTheme();

    interface Style {
        centeredView: ViewStyle;
        modalView: ViewStyle;
        input: ViewStyle;
        actionsContainer: ViewStyle;
        actions: ViewStyle;
        modalText: TextStyle;
        openButton: ViewStyle;
    }
    const styles = StyleSheet.create<Style>({
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

    const [value, setValue] = useState(null)

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={open}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{description}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={text => setValue(text)}
                        placeholderTextColor={colors.text2}

                        underlineColorAndroid={colors.text}
                    />
                    <View style={styles.actionsContainer}>
                        <View style={styles.actions}>
                            <Pressable
                                onPress={onCancel}
                                style={styles.openButton}
                            >
                                <Text style={styles.openButton}>
                                    Abbrechen
                                </Text>
                            </Pressable>
                            <Pressable
                                style={styles.openButton}
                                onPress={()=>{onSubmit(value)}}
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
    )


};

