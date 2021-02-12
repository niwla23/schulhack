"use strict"

import React, { useEffect, useState } from 'react';
import { Button, Text, View, StyleSheet, ViewStyle, TextStyle, ToastAndroid } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { acc, color } from 'react-native-reanimated';
import { useTheme } from '../theme/themeprovider';
import * as Keychain from 'react-native-keychain';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';


function makeUrl(url) {
    if (!url) {
        return ""
    }
    if (!(url.startsWith("https://") || url.startsWith("http://"))) {
        url = "https://" + url
    }
    if (url.slice(-1) === "/") {
        url = url.slice(0, -1);
    }
    if (!url.includes(".")) {
        return ""
    }
    return url
}


export default function LoginScreen({ navigation, route }) {
    const { colors, isDark } = useTheme();

    const [email, setEmail] = useState("")
    const [server, setServer] = useState(null)
    const [user, setUser] = useState(null)
    const [password, setPassword] = useState(null)
    const [accepted, setAccepted] = useState(false)

    useEffect(() => {
        AsyncStorage.getItem("@server").then(r => {
            if (r) {
                setServer(r)
            }
        })

    }, []);


    interface Style {
        background: ViewStyle;
        wrapper: ViewStyle;
        input: ViewStyle;
        header: TextStyle;
        description: TextStyle;
        checkboxContainer: ViewStyle;
        checkbox: ViewStyle;
    }
    const styles = StyleSheet.create<Style>({
        background: {
            backgroundColor: colors.background,
            flex: 1,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: "100%"
        },
        wrapper: {
            margin: 20,
            padding: 20,
            width: "95%",
            height: "100%"
        },
        header: {
            textAlign: "center",
            color: colors.text,
            fontSize: 30,
            paddingBottom: 40,
            paddingTop: 20
        },
        description: {
            color: colors.text,
            paddingBottom: 20,

        },
        input: {
            color: colors.text,
            width: "100%",
            marginBottom: 5
        },
        checkboxContainer: {
            flexDirection: "row",
            marginBottom: 20,
        },
        checkbox: {
            alignSelf: "baseline",
        }
    })

    return (
        <View style={styles.background}>
            <View style={styles.wrapper}>
                <Text style={styles.header}>SchulHack</Text>
                <Text style={styles.description}>Um SchulHack zu nutzen musst du dich mit deinem eigenen Iserv Account anmelden.{"\n"}
                </Text>
                <TextInput
                    placeholderTextColor={colors.text2}
                    underlineColorAndroid={colors.text}
                    autoCapitalize={"none"}
                    autoCompleteType={'email'}
                    autoCorrect={false}
                    keyboardType={"email-address"}
                    style={styles.input}
                    placeholder="Iserv E-mail Adresse"
                    value={email}
                    onChangeText={(value) => {
                        setEmail(value)
                        setServer(value.split("@")[1])
                        setUser(value.split("@")[0])
                    }}
                />
                <TextInput
                    placeholderTextColor={colors.text2}
                    underlineColorAndroid={colors.text}
                    style={styles.input}
                    placeholder="Iserv Passwort"
                    autoCompleteType="password"
                    autoCorrect={false}
                    autoCapitalize={"none"}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(value) => {
                        setPassword(value)
                    }}
                />
                {/* <View style={styles.checkboxCotainer}>
                    <CheckBox
                    style={styles.checkbox}
                        tintColor="#fff"
                        tintColors={{ true: colors.primary, false: "#fff" }}
                        value={accepted}
                        onValueChange={(newValue) => setAccepted(newValue)}
                    />
                    <Text style={styles.description}>Ich habe die Datenschutzerklärung und den Haftungsauschluss gelesen.</Text>
                </View> */}
                <View style={styles.checkboxContainer}>
                    <CheckBox
                        value={accepted}
                        onValueChange={setAccepted}
                        tintColors={{ true: colors.primary, false: colors.text }}
                        style={styles.checkbox}
                    />
                    <Text onPress={() => { navigation.navigate("Info") }} style={styles.description}>Ich habe die Datenschutzerklärung und den Haftungsauschluss gelesen.</Text>
                </View>

                <Button
                    color={colors.primary}
                    disabled={!(makeUrl(server) && user && password && accepted)}
                    title="Login"
                    onPress={async () => {
                        try {
                            await AsyncStorage.setItem("@server", makeUrl(server))
                            await AsyncStorage.setItem("@intro_shown", "true")
                            await AsyncStorage.removeItem("@cookie")
                            await AsyncStorage.removeItem("@cookie_expires")
                            await Keychain.setGenericPassword(user, password)

                        } catch {
                            ToastAndroid.show("Anmeldung fehlgeschlagen", ToastAndroid.LONG)
                        }

                        setEmail("")
                        setPassword(null)
                        setUser(null)

                        // try {
                        //     navigation.navigate(route.params.target)
                        // } catch {
                        //     navigation.navigate("App")
                        // }

                        route.params.setIsLoggedIn(true)



                    }}
                />
            </View>

        </View>
    );
}