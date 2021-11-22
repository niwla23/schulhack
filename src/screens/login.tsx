"use strict"

import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ViewStyle, ImageStyle, TextStyle, ToastAndroid, Image, Keyboard } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Button from '../components/button'
import { useTheme } from '../theme/themeprovider';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IservWrapper } from '../iservscrapping/iservWrapper'
import * as Keychain from 'react-native-keychain';


function makeUrl(url: string) {
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
    const [server, setServer] = useState("")
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
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
        logo: ImageStyle;
        button: ViewStyle;
        buttonText: TextStyle;
    }
    const styles = StyleSheet.create<Style>({
        background: {
            backgroundColor: colors.background,
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
            marginBottom: 5,
            backgroundColor: colors.background2,
            borderRadius: 200,
            padding: 10
        },
        checkboxContainer: {
            flexDirection: "row",
            marginBottom: 2,
        },
        checkbox: {
            alignSelf: "baseline",
        },
        logo: {
            position: 'absolute',
            left: 0,
            top: 130
        },
        button: {
            backgroundColor: colors.primary,
            borderRadius: 200,
            padding: 10,
        },
        buttonText: {
            textAlign: "center",
            width: "100%"
        }
    })

    return (
        <View style={styles.background}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode={"contain"}></Image>
            <View style={styles.wrapper}>
                <Text style={styles.header}>SchulHack</Text>
                <Text style={styles.description}>Um SchulHack zu nutzen musst du dich mit deinem eigenen Iserv Account anmelden.{"\n"}
                </Text>
                <TextInput
                    placeholderTextColor={colors.text2}
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
                    text="LOGIN"
                    onPress={async () => {
                        if (makeUrl(server) && user && password && accepted) {
                            try {
                                await AsyncStorage.setItem("@server", makeUrl(server))
                                await AsyncStorage.setItem("@intro_shown", "true")

                                let expire_date = new Date()
                                expire_date.setFullYear(expire_date.getFullYear()+1)
                                await AsyncStorage.setItem("@cookie_expires", expire_date.toISOString())
                                let iserv = await IservWrapper.login(server, user, password)

                            } catch(e) {
                                ToastAndroid.show(`Anmeldung fehlgeschlagen ${e}`, ToastAndroid.LONG)
                            }

                            setEmail("")
                            setPassword("")
                            setUser("")

                            route.params.setIsLoggedIn(true)
                        } else {
                            ToastAndroid.show("Bitte fülle alle Felder aus", ToastAndroid.LONG)
                        }
                    }}
                />
            </View>

        </View>
    );
}