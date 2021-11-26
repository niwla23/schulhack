"use strict"

import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme/themeprovider';
import { TextInput } from 'react-native';
import Button from '../components/button'


export default function EditTimetableScreen({ navigation, route }) {

    const { colors, isDark } = useTheme();
    const [subject, setSubject] = useState(route.params.subject);
    const [teacher, setTeacher] = useState(route.params.teacher);
    const [room, setRoom] = useState(route.params.room);

    interface Style {
        background: ViewStyle;
        input: ViewStyle;

    }
    const styles = StyleSheet.create<Style>({
        background: {
            backgroundColor: colors.background,
            height: "100%",
            padding: 8
        },
        input: {
            color: colors.text,
            width: "100%",
            marginBottom: 5
        },
    })

    return (

        <View style={styles.background}>
            <TextInput
                placeholderTextColor={colors.text2}
                underlineColorAndroid={colors.text}
                style={styles.input}
                placeholder="Fach"
                value={subject}
                onChangeText={(value) => {
                    setSubject(value)
                }}
            />
            <TextInput
                placeholderTextColor={colors.text2}
                underlineColorAndroid={colors.text}
                style={styles.input}
                placeholder="Lehrer"
                value={teacher}
                onChangeText={(value) => {
                    setTeacher(value)
                }}
            />
            <TextInput
                placeholderTextColor={colors.text2}
                underlineColorAndroid={colors.text}
                style={styles.input}
                placeholder="Raum"
                value={room}
                onChangeText={(value) => {
                    setRoom(value)
                }}
            />
            <Button
                text="Speichern"
                type="primary"
                onPress={() => {
                    AsyncStorage.setItem(`timetable.${route.params.day}.${route.params.hour}`, JSON.stringify({
                        subject: subject,
                        room: room,
                        teacher: teacher,
                        day: route.params.day,
                        hour: route.params.hour
                    }))
                    navigation.goBack()
                }}
            />
            <View style={{ height: 8 }}></View>
            <Button
                text="Löschen"
                type="danger"
                onPress={() => {
                    AsyncStorage.removeItem(`timetable.${route.params.day}.${route.params.hour}`)
                    navigation.goBack()
                }}
            />
        </View>
    );
}