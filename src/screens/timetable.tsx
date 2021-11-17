"use strict"

import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Switch, View, StyleSheet, ViewStyle, TextStyle, Button, Share, Pressable } from 'react-native';
import { useTheme } from '../theme/themeprovider';
import { FlatList } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { Col, Row, Grid } from "react-native-easy-grid";
import deserializeTimetable from '../helpers/deserializeTimetable';
import base64 from 'react-native-base64'
import { TextInputModal } from '../components/textInputModal';
import serializeTimetable from '../helpers/serializeTimetable';



export const TimetableItem = ({ item, isWeekView }) => {
    const { colors, isDark } = useTheme();
    const navigation = useNavigation()

    interface Style {
        itemWrapper: ViewStyle;
        itemContainer: ViewStyle;
        itemTitle: TextStyle;
        itemContent: TextStyle;
        editIcon: TextStyle;
        editPressable: ViewStyle;

    }
    const styles = StyleSheet.create<Style>({
        itemWrapper: {
            padding: 5
        },
        itemContainer: {
            marginBottom: isWeekView ? "auto" : 16,
            paddingHorizontal: isWeekView ? 10 : 24,
            backgroundColor: colors.background2,
            padding: isWeekView ? 10 : 20,
            paddingRight: isWeekView ? 2 : 8,
            borderRadius: 8,
            flexDirection: "row",
            justifyContent: "space-between",
            height: isWeekView ? "100%" : "auto",
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
        },

    });


    if (isWeekView) {
        return (
            <View style={styles.itemWrapper}>
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
                </View>
            </View>
        );
    } else {
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

}


export default function TimetableScreen({ navigation }) {

    const { colors, isDark } = useTheme();

    const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"]
    const weekdays_short = ["Mo", "Di", "Mi", "Do", "Fr"]

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
        const tt = await deserializeTimetable()
        setTimetable(tt)
    }

    const exportTimetable = async () => {
        const tt = await deserializeTimetable()
        await Share.share({ "message": JSON.stringify(tt), "title": "Stundenplan" })
    }

    const [importModalOpen, setimportModalOpen] = useState(false)
    const importTimetable = async (data: string) => {
        setimportModalOpen(false)
        try {
            let json_data = JSON.parse(data)
            await serializeTimetable(json_data)
        } catch (e) {
            console.error("failed to import data", e)
        }
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

    const [weekView, setWeekView] = useState(false)

    interface Style {
        background: ViewStyle;
        daySwitchContainer: ViewStyle;
        list: ViewStyle;
        dayTabsContainer: ViewStyle;
        dayTabContainer: ViewStyle;
        dayTabText: TextStyle;
        noPlanText: TextStyle;
        noPlanContainer: ViewStyle;
        appBarRight: ViewStyle;
        appBarIcon: ViewStyle;

    }
    const styles = StyleSheet.create<Style>({
        background: {
            backgroundColor: colors.background,
            height: "100%",
            paddingTop: 10
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
        },
        appBarRight: {
            display: "flex",
            flexDirection: "row",
        },
        appBarIcon: {
            paddingRight: 24,
            color: colors.text,
            fontSize: 22
        }
    })

    React.useLayoutEffect(() => {

        navigation.setOptions({
            headerRight: () => (
                <View style={styles.appBarRight}>
                    <Pressable onPress={() => { console.log(weekView); setWeekView(!weekView); console.log(weekView) }}>
                        <FontAwesome5 style={styles.appBarIcon} name={weekView ? "calendar-day" : "calendar-week"}></FontAwesome5>
                    </Pressable>
                    <Pressable onPress={exportTimetable}><FontAwesome5 style={styles.appBarIcon} name={"download"}></FontAwesome5></Pressable>
                    <Pressable onPress={() => { setimportModalOpen(true) }}><FontAwesome5 style={styles.appBarIcon} name={"file-import"}></FontAwesome5></Pressable>
                </View>
            ),
        });
    }, [navigation, weekView, setWeekView]);

    let tableContent = (
        <></>
    )

    if (weekView) {
        // week view
        let lists: Element[] = []
        let lessons = ["1/2", "3/4", "5/6"]

        let firstRowContent: Element[] = []
        firstRowContent.push(<Col size={0.5}></Col>)
        lessons.forEach((item) => {
            firstRowContent.push(<Col><Text style={{ color: colors.text, textAlign: "center" }}>{item}</Text></Col>)
        })
        let firstRow = (<Row size={0.2}>{firstRowContent}</Row>)

        lists.push(firstRow)

        let iterations = [...Array(5).keys()]
        iterations.forEach((element) => {
            lists.push(
                <Row key={"day" + element.toString()}>
                    <Col size={0.5} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}><Text style={{ color: colors.text, textAlign: "center" }}>{weekdays_short[element]}</Text></Col>
                    {timetable[element].map((item, index: number) =>
                        <Col key={"day" + element.toString() + "lesson" + index.toString()}>
                            {/* <Text style={{}}>{item.subject}</Text> */}
                            <TimetableItem item={item} isWeekView={true}></TimetableItem>
                        </Col>
                    )}
                </Row>
            )
        });

        tableContent = (
            // <View style={{ display: "flex", flexDirection: "row" }}>
            //     {lists}
            // </View>
            <Grid style={{ paddingBottom: 32 }}>
                {lists}
            </Grid>
        )
    } else {
        // day view
        tableContent = (
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
                    renderItem={({ item }) => { return (<TimetableItem isWeekView={false} key={String(Math.random())} item={item}></TimetableItem>) }}
                />
            </>
        )
    }

    return (

        <View style={styles.background}>
            <TextInputModal open={importModalOpen} onSubmit={importTimetable} onCancel={() => {setimportModalOpen(false)}} description="hi" placeholder="test" />
            {timetableExists && tableContent}
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