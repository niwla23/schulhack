"use strict"

import React, { useState, useEffect } from 'react';
import { Text, Switch, View, StyleSheet, ViewStyle, TextStyle, SectionList, Button, RefreshControl } from 'react-native';
import { useTheme } from '../theme/themeprovider';
import { PlanItem } from '../components/planitem';
import { ListError } from '../components/listError'
import { IservWrapper } from '../iservscrapping/iservWrapper';


export default function SubstitutionScreen({ navigation }) {

    const { colors, isDark } = useTheme();

    const [isNextDay, setIsNextDay] = useState(true);
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState(null)
    const errorToText = (e: String) => {
        const x = { "login failed": "Anmeldung fehlgeschlagen" }
        return x[e] || e
    };
    const toggleSwitch = () => {
        setIsNextDay((previousState) => {
            load_plan(!previousState)
            return !previousState
        })
    };
    const refresh = () => {
        load_plan(isNextDay)
    }
    const [data, setData] = useState([])

    const load_plan = (isNextDay: Boolean) => {
        setData([])
        setLoaded(false)
        setError(null)
        const iserv = new IservWrapper
        iserv.init().then(() => {
            iserv.getSubstitutionPlan(isNextDay).then(plan => {
                setData(plan)
                setLoaded(true)
            }).catch(e => {
                setError(e.toString())
                setLoaded(true)
            })
        })
            .catch(e => {
                setError(e.toString())
                setLoaded(true)
            })

    }

    useEffect(() => {
        load_plan(isNextDay)
    }, []);




    interface Style {
        background: ViewStyle;
        daySwitchContainer: ViewStyle;
        defaultText: TextStyle;
        daySwitch: ViewStyle;
        header: ViewStyle;
        courseHeader: TextStyle;
        errorText: TextStyle;
        errorIcon: ViewStyle;
        listHeader: TextStyle;
        noItems: ViewStyle;
    }
    const styles = StyleSheet.create<Style>({
        background: {
            backgroundColor: colors.background,
            height: "100%"
        },
        header: {
            paddingBottom: 32,
        },
        daySwitchContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8
        },
        daySwitch: {

        },
        defaultText: {
            color: colors.text
        },

        courseHeader: {
            fontSize: 24,
            paddingLeft: 16,
            color: colors.text,
            marginTop: 16,
        },
        errorIcon: {
            color: colors.primary,
            fontSize: 100,
            textAlign: 'center',
            paddingTop: 100
        },
        errorText: {
            marginTop: 50,
            color: colors.text,
            fontSize: 20,
            textAlign: "center",
        },
        listHeader: {
            color: colors.text,
            marginLeft: 16

        },
        noItems: {

            marginLeft: 32,
            marginRight: 32,
        }

    })

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.daySwitchContainer}>
                    <Text style={styles.defaultText}>Heute</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: colors.secondary }}
                        thumbColor={colors.primary}
                        onValueChange={toggleSwitch}
                        value={isNextDay}
                        style={styles.daySwitch}
                    />
                    <Text style={styles.defaultText}>Morgen</Text>

                </View>
            ),
        });
    }, [navigation, isNextDay, styles, toggleSwitch]);

    return (

        <View style={styles.background}>

            <SectionList
                sections={data.plan}
                refreshControl={
                    <RefreshControl
                        colors={[colors.primary]}
                        progressBackgroundColor={colors.background2}
                        refreshing={!loaded}
                        onRefresh={refresh}
                    />}
                ListHeaderComponent={() => {
                    if (loaded) {
                        return (
                            <Text style={styles.listHeader}>{data.date}, {data.week} Woche</Text>
                        )
                    } else {
                        return <></>
                    }

                }}
                ListFooterComponent={() => { return (<View style={{ height: 40 }} />) }}
                style={{ padding: 8 }}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => <PlanItem content={item} />}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.courseHeader}>{title}</Text>
                )}
                ListEmptyComponent={() => {
                    if (error) {
                        return ListError({ error: error, icon: "bug" })
                    } else if (!loaded) {
                        return <></>
                    } else {
                        // return ListError({ error: "Keine Einträge für deine Klassen. Du kannst deine Klassen in den Einstellungen ändern", icon: "search" })
                        return (
                            <>

                                <View style={styles.noItems}>
                                    <ListError
                                        error="Keine Einträge für deine Klassen. Du kannst deine Klassen in den Einstellungen ändern"
                                        icon="search"

                                    />
                                    <View style={{ marginBottom: 16 }}></View>
                                    <Button onPress={() => navigation.navigate("Settings")} color={colors.primary} title="Einstellungen"></Button>
                                </View>

                            </>
                        )
                    }

                }}
            />
        </View>
    );
}