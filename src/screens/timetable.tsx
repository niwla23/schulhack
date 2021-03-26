"use strict"

import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Switch, View, StyleSheet, ViewStyle, TextStyle, SectionList, Button, Touchable, Pressable } from 'react-native';
import { useTheme } from '../theme/themeprovider';
import { FlatList } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';


export const TimetableItem = ({ item }) => {
    const { colors, isDark } = useTheme();
    const navigation = useNavigation()

    interface Style {
        itemContainer: ViewStyle;
        itemTitle: TextStyle;
        itemContent: TextStyle;
        editIcon: TextStyle;
        editPressable: ViewStyle;
    }
    const styles = StyleSheet.create<Style>({
        itemContainer: {
            marginBottom: 16,
            paddingHorizontal: 24,
            backgroundColor: colors.background2,
            padding: 20,
            paddingRight: 8,
            borderRadius: 8,
            flexDirection: "row",
            justifyContent: "space-between"
        },
        itemTitle: {
            fontSize: 20,
            fontWeight: '600',
            color: colors.text,
        },
        itemContent: {
            fontSize: 16,
            color: colors.text2,
        },
        editPressable: {
            justifyContent: "center",
            padding: 16
        },
        editIcon: {
            color: colors.text,
            fontSize: 22
        }
    });

    return (
        <View style={styles.itemContainer}>
            <View>
                <Text style={styles.itemTitle}>
                    {item.subject}
                </Text>
                <Text style={styles.itemContent}>
                    {item.room}
                </Text>
                <Text style={styles.itemContent}>
                    {item.teacher}
                </Text>
            </View>
            <Pressable
                style={styles.editPressable}
                onPress={() => {
                    navigation.navigate("Edit",
                        {
                            subject: item.subject,
                            room: item.room,
                            teacher: item.teacher,
                            day: item.day,
                            hour: item.hour
                        }
                    )
                }}
                android_ripple={{ color: colors.text2 }}

            >

                <FontAwesome5 style={styles.editIcon} name={"pen"}></FontAwesome5>
            </Pressable>

        </View>
    );
}


export default function TimetableScreen({ navigation }) {

    const { colors, isDark } = useTheme();

    const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"]

    const [timetable, setTimetable] = useState([]);
    const [currentDay, setCurrentDay] = useState(new Date().getDay() < 5 ? new Date().getDay() : 0)
    const [timetableExists, setTimetableExists] = useState(true)

    const createTimetable = async () => {
        var i = 0
        while (i < 5) {
            var j = 0
            while (j < 3) {
                let _ = await AsyncStorage.setItem(`timetable.${i}.${j}`, JSON.stringify(
                    {
                        "teacher": null,
                        "subject": null,
                        "room": null,
                        "day": i,
                        "hour": j
                    }
                ))
                j++

            }
            i++
        }
        await loadTimetable()
        AsyncStorage.setItem("timetable.exists", "true")
    }


    const loadTimetable = async () => {
        const table2 = []
        var i = 0
        while (i < 5) {
            let d = table2[table2.push([]) - 1]
            var j = 0
            while (j < 3) {
                let raw: string | null = await AsyncStorage.getItem(`timetable.${i}.${j}`)
                if (raw) {
                    d.push(JSON.parse(raw))
                }
                j++
            }
            i++
        }
        setTimetable(table2)
    }

    useEffect(() => {
        // loadTimetable()
        AsyncStorage.getItem("timetable.exists").then(r => {
            setTimetableExists(Boolean(r))
        })
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener(
            'focus',
            loadTimetable
        );

        return () => {
            unsubscribe();
        };
    }, [loadTimetable]);

    interface Style {
        background: ViewStyle;
        daySwitchContainer: ViewStyle;
        list: ViewStyle;
        dayTabsContainer: ViewStyle;
        dayTabContainer: ViewStyle;
        dayTabText: TextStyle;
        noPlanText: TextStyle;
        noPlanContainer: ViewStyle;

    }
    const styles = StyleSheet.create<Style>({
        background: {
            backgroundColor: colors.background,
            height: "100%"
        },
        daySwitchContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8
        },
        list: {
            padding: 8,
            paddingTop: 0
        },
        dayTabsContainer: {
            flexDirection: 'row',
            alignItems: "center",
            justifyContent: "space-evenly",
            paddingTop: 8,
            paddingBottom: 8
        },
        dayTabContainer: {
            padding: 5,
            borderRadius: 8
        },
        dayTabText: {
            color: colors.text
        },
        noPlanText: {
            color: colors.text,
            marginBottom: 8,
            textAlign: "center"
        },
        noPlanContainer: {
            padding: 8,
            marginLeft: 32,
            marginRight: 32,
            justifyContent: "center",
            height: "100%"
        }
    })

    // React.useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerRight: () => (
    //             <View>

    //             </View>
    //         ),
    //     });
    // }, [navigation]);

    return (

        <View style={styles.background}>
            {timetableExists &&
                <>
                    <View style={styles.dayTabsContainer}>
                        {[1, 2, 3, 4, 5].map((day, index) =>
                            <Pressable
                                key={index}
                                style={[{ backgroundColor: index === currentDay ? colors.primary : colors.background }, styles.dayTabContainer]}
                                onPress={() => { setCurrentDay(index) }}
                            >
                                <Text style={styles.dayTabText}>{weekdays[index]}</Text>
                            </Pressable>
                        )}

                    </View>
                    <FlatList
                        style={styles.list}
                        data={timetable[currentDay]}
                        keyExtractor={item => String(item.day) + String(item.hour)}
                        renderItem={({ item }) => { return (<TimetableItem key={String(Math.random())} item={item}></TimetableItem>) }}
                    />
                </>
            }
            {!timetableExists &&

                <View style={styles.noPlanContainer}>
                    <Text style={styles.noPlanText}>Du hast bisher keinen Stundenplan erstellt. Nachdem du deinen Stundenplan erstellt hast, kannst du ihn bearbeiten.</Text>
                    <Button
                        title="Stundenplan erstellen"
                        color={colors.primary}
                        onPress={() => {
                            createTimetable()
                            setTimetableExists(true)
                        }} />
                </View>

            }

        </View>
    );
}