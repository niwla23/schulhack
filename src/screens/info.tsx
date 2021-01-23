"use strict"

import React from 'react';
import { Button, Text, View, StyleSheet, ViewStyle, TextStyle, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Header } from '../components/header';
import { useTheme } from '../theme/themeprovider';




export default function InfoScreen({ navigation }) {
    const { colors, isDark } = useTheme();

    interface Style {
        background: ViewStyle;
        contentContainer: ViewStyle;
        subHeader: TextStyle;
        text: TextStyle;
        boldText: TextStyle;
        libraryInfoItemContainer: ViewStyle;
    }
    const styles = StyleSheet.create<Style>({
        background: {
            backgroundColor: colors.background,
            height: "100%",
        },
        contentContainer: {
            padding: 20
        },
        subHeader: {
            fontSize: 24,
            color: colors.text,
            paddingTop: 20
        },
        text: {
            color: colors.text
        },
        boldText: {
            color: colors.text,
            fontWeight: "bold"
        },
        libraryInfoItemContainer: {
            paddingTop: 10,
            paddingBottom: 10
        }
    })

    function LibraryInfo(props) {
        return (
            <Pressable android_ripple={{color: colors.background2}} style={styles.libraryInfoItemContainer}>
                <Text style={styles.boldText}>{props.name}</Text>
                <Text style={styles.text}>{props.license}</Text>
            </Pressable>
        )
        

    }

    return (
        <ScrollView style={styles.background}>
            <Header action="back" openDrawer={navigation.goBack} title="Über diese App"></Header>
            <View style={styles.contentContainer}>
                <Text style={styles.subHeader}>Entwickler</Text>
                <Text style={styles.text}>Diese App wurde von Alwin Lohrie entwickelt.{"\n"}Der Quellcode ist öffentlich unter der General Public License zugänglich: [url einfügen!]</Text>
                <Text style={styles.subHeader}>Haftungsauschluss</Text>
                <Text style={styles.text}>Es wird keine Haftung für vom Benutzer angegebe Server übernommen. Es ist dem Entwickler nicht möglich diese App für alle Iserv Systeme zu testen. Die App kann nur funktionieren wenn der Iserv Server funktioniert und die Pläne an den angegebenen Pfaden vorhanden sind. Außerdem kann keine Haftung für die Richtigkeit der gezeigten Daten übernommen werden.</Text>
                <Text style={styles.subHeader}>Datenschutz</Text>
                <Text style={styles.text}>Diese App sendet keine Daten an andere Server als der, der in den Einstellungen angegeben wurde. An diesen werden beim ersten Start zwei Anfragen gestellt.{"\n"}Die erste dient dem Login. Der angegebene Server sollte mit den Cookies, die für folgende Anfragen verwendet werden können, antworten.{"\n"}Sobald der Server geantwortet hat, wird eine zweite Anfrage gestellt um den Vertretungsplan abzurufen.{"\n"}Das Passwort wird in einer sicheren, sogenannten Keychain gespeichert.{"\n"}Es werden keine Analyse Tools eingesetzt.{"\n"}</Text>
                <Text style={styles.subHeader}>Open Source</Text>
                <Text style={styles.text}>Folgende Bibliotheken und Ressourcen sind in dieser App enthalten:</Text>
                <LibraryInfo name="@react-native-async-storage/async-storage" license="MIT License" />
                <LibraryInfo name="@react-native-community/masked-view" license="MIT License" />
                <LibraryInfo name="@react-navigation/drawer" license="MIT License" />
                <LibraryInfo name="react" license="MIT License" />
                <LibraryInfo name="react-native" license="MIT License" />
                <LibraryInfo name="react-native-appearance" license="MIT License" />
                <LibraryInfo name="react-native-cheerio" license="MIT License" />
                <LibraryInfo name="axios" license="MIT License" />
                <LibraryInfo name="react-native-gesture-handler" license="MIT License" />
                <LibraryInfo name="react-native-keychain" license="MIT License" />
                <LibraryInfo name="react-native-reanimated" license="MIT License" />
                <LibraryInfo name="react-native-safe-area-context" license="MIT License" />
                <LibraryInfo name="react-native-screens" license="MIT License" />
                <LibraryInfo name="react-native-tags" license="MIT License"/>
                <LibraryInfo name="react-native-vector-icons" license="MIT License"/>
                
            </View>

        </ScrollView>
    );
}