import React, { useEffect, useState } from 'react';
import { Button, Text, View, StyleSheet, ViewStyle, FlatList, TextStyle, Alert } from 'react-native';
import type { Type } from "react-native"
import { useTheme } from '../theme/themeprovider';
import { Header } from '../components/header';
import ListError from '../components/listError';
import { BirthdayItem } from '../components/birthdayitem'
import { IservWrapper } from '../iservscrapping';

export default function BirthdaysScreen({ navigation }) {
    const { colors, isDark } = useTheme();
    const [birthdays, setBirthdays] = useState([])

    const [loaded, setLoaded] = useState(false)

    function loadBirthdays() {
        setLoaded(false)
        const iserv = new IservWrapper
        iserv.init().then(() => {
            iserv.getBirthdays().then(fetchedBDays => {
                setBirthdays(fetchedBDays)
                setLoaded(true)
            })
                .catch(e => {
                    setLoaded(true)
                    // setError(e.toString())
                })

        }).catch(e => {
            setLoaded(true)
            // setError(e.toString())
        })
    }

    useEffect(() => {
        loadBirthdays()
    }, []);

    interface Style {
        background: ViewStyle;
        defaultText: TextStyle;
        header: ViewStyle;
        courseHeader: TextStyle;
        noItemsFoundText: TextStyle;
        errorText: TextStyle;
        errorIcon: ViewStyle;
    }
    const styles: Style = StyleSheet.create<Style>({
        background: {
            backgroundColor: colors.background,
            height: "100%"
        },
        header: {

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
        noItemsFoundText: {
            paddingTop: 32,
            textAlign: "center",
            color: colors.text
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
    })

    const renderItem = ({ item }) => (
        <BirthdayItem highlighted={item.highlight} name={item.name} date={item.date} />
    );

    return (

        <View style={styles.background}>
            <View style={styles.header}>
                <Header action="drawer" title="Geburtstage" openDrawer={() => {
                    navigation.openDrawer()
                }}>
                </Header>
            </View>
            <FlatList
                data={birthdays}
                refreshing={!loaded}
                onRefresh={loadBirthdays}
                renderItem={renderItem}
                keyExtractor={item => item.name}
            />
        </View>
    );
}