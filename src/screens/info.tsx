"use strict"

import React from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle, Pressable, Linking } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Link } from '../components/link'
import { useTheme } from '../theme/themeprovider';
import * as licenses from '../../licenses.json'



export default function InfoScreen({ navigation }) {
    const { colors, isDark } = useTheme();

    interface Style {
        background: ViewStyle;
        contentContainer: ViewStyle;
        subHeader: TextStyle;
        text: TextStyle;
        link: TextStyle;
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
        link: {
            color: "blue",
            textDecorationLine: "underline"
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
            <Pressable onPress={() => Linking.openURL(props.url)} android_ripple={{ color: colors.background2 }} style={styles.libraryInfoItemContainer}>
                <Text style={styles.boldText}>{props.name}</Text>
                <Text style={styles.text}>{props.license}</Text>
            </Pressable>
        )


    }

    return (
        <ScrollView style={styles.background}>
            <View style={styles.contentContainer}>
                <Text style={styles.subHeader}>Entwickler</Text>
                <Text style={styles.text}>Diese App wurde von Alwin Lohrie entwickelt.{"\n"}Der <Link text="Quellcode" url="https://schulhack.tk/source"/> ist öffentlich unter der General Public License zugänglich</Text>
                <Text style={styles.subHeader}>Haftungsauschluss</Text>
                <Text style={styles.text}>Es wird keine Haftung für vom Benutzer angegebe Server übernommen. Es ist dem Entwickler nicht möglich diese App für alle Iserv Systeme zu testen. Die App kann nur funktionieren wenn der Iserv Server funktioniert und die Pläne an den angegebenen Pfaden vorhanden sind. Außerdem kann keine Haftung für die Richtigkeit der gezeigten Daten übernommen werden.</Text>
                <Text style={styles.subHeader}>Datenschutz</Text>
                <Text style={styles.text}>Diese App sendet keine Daten an andere Server als der, der in den Einstellungen angegeben wurde. An diesen werden beim ersten Start zwei Anfragen gestellt.{"\n"}Die erste dient dem Login. Der angegebene Server sollte mit den Cookies, die für folgende Anfragen verwendet werden können, antworten.{"\n"}Sobald der Server geantwortet hat, wird eine zweite Anfrage gestellt um den Vertretungsplan abzurufen.{"\n"}Das Passwort wird in einer sicheren, sogenannten Keychain gespeichert.{"\n"}Es werden keine Analyse Tools eingesetzt.{"\n"}</Text>
                <Text style={styles.subHeader}>Open Source</Text>
                <Text style={styles.text}>Folgende Bibliotheken und Ressourcen sind in dieser App enthalten:</Text>
                {Object.keys(licenses).map((dependency, i) =>
                    <LibraryInfo
                        key={i}
                        name={dependency}
                        url={licenses[dependency].repository}
                        license={licenses[dependency].licenses + " License"}
                    />
                )}

            </View>

        </ScrollView>
    );
}