import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    ImageBackground,
} from 'react-native';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import { AppearanceProvider } from 'react-native-appearance';
import { ThemeProvider, useTheme } from './theme/themeprovider';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import SubstitutionScreen from "./screens/substitutionplan"
import TasksScreen from "./screens/tasks"
import ClassTestsScreen from "./screens/classtests"
import BirthdaysScreen from "./screens/birthdays"
import SettingsScreen from "./screens/settings"
import LoginScreen from './screens/login';
import MenuScreen from './screens/menu'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';


const Drawer = createDrawerNavigator();

export interface Props { }


export const Navigation: React.FC<Props> = (props) => {



    useEffect(() => {
        // Lets pretend that this does not exist. Just skip to line 68
        // Keychain.getGenericPassword().then(r => {
        //     setUserName(r.username)
        // })
        // AsyncStorage.getItem("@server").then(r => {
        //     setServer(r)
        // })

        const hack = setInterval(() => {
            Keychain.getGenericPassword().then(r => {
                setUserName(r.username)
            })
            AsyncStorage.getItem("@server").then(r => {
                setServer(r?.split("://")[1])
            })
        }, 1000);
    }, []);


    const { colors, isDark } = useTheme();
    const styles = StyleSheet.create({
        drawer: {
            backgroundColor: colors.background,
            width: "100%"
        },
        drawerItemLabel: {
            color: colors.text,
            width: "100%"
        },
        appTitle: {
            color: "#fff",
            textShadowRadius: 20,
            textShadowColor: "#000",
            fontSize: 32,
            fontWeight: "bold"
        },
        appSubTitle: {
            color: "#fff",
            fontSize: 16,
            textShadowRadius: 15,
            textShadowColor: "#000",
            fontWeight: "bold"
        },
        appHeader: {
            padding: 20,
            paddingTop: "60%",
            marginTop: -4,
            flex: 1,
        },
        icon: {
            color: colors.text,
            marginRight: -15,
            fontSize: 16

        }
    });

    const [userName, setUserName] = useState("laden")
    const [server, setServer] = useState("laden")

    function CustomDrawerContent(props) {
        AsyncStorage.getItem("@intro_shown").then(intro_shown => {
            if (!intro_shown) {
                props.navigation.navigate("Login")
                return
            }
        })

        return (
            <DrawerContentScrollView {...props}>
                <ImageBackground source={require("../assets/background.jpg")} style={styles.appHeader}>
                    <Text style={styles.appTitle}>SchulHack</Text>
                    <Text style={styles.appSubTitle}>{userName}@{server}</Text>
                </ImageBackground>

                <DrawerItem
                    label="Vertretungsplan"
                    labelStyle={styles.drawerItemLabel}
                    icon={SubstitutionPlanIcon}
                    focused={false}
                    activeTintColor={colors.primary}
                    onPress={() => props.navigation.navigate("SubstitutionPlan")}
                />
                <DrawerItem
                    label="Aufgaben"
                    labelStyle={styles.drawerItemLabel}
                    icon={TasksIcon}
                    onPress={() => props.navigation.navigate("Tasks")}
                />
                {/* <DrawerItem
                    label="Arbeiten"
                    labelStyle={styles.drawerItemLabel}
                    icon={ClassTestsIcon}
                    onPress={() => props.navigation.navigate("ClassTests")}
                />
                <DrawerItem
                    label="Geburtstage"
                    labelStyle={styles.drawerItemLabel}
                    icon={BirthdayIcon}
                    onPress={() => props.navigation.navigate("Birthdays")}
                /> */}
                <DrawerItem
                    label="Einstellungen"
                    labelStyle={styles.drawerItemLabel}
                    icon={SettingsIcon}
                    onPress={() => props.navigation.navigate("Settings")}
                />
            </DrawerContentScrollView>
        );
    }

    function SubstitutionPlanIcon() {
        return (
            <FontAwesome5 name="exchange-alt" style={styles.icon}></FontAwesome5>
        )
    }

    function TasksIcon() {
        return (
            <FontAwesome5 name="tasks" style={styles.icon}></FontAwesome5>
        )
    }

    function ClassTestsIcon() {
        return (
            <FontAwesome5 name="poo" style={styles.icon}></FontAwesome5>
        )
    }

    function BirthdayIcon() {
        return (
            <FontAwesome5 name="birthday-cake" style={styles.icon}></FontAwesome5>
        )
    }

    function SettingsIcon() {
        return (
            <FontAwesome5 name="cog" style={styles.icon}></FontAwesome5>
        )
    }

    return (
        <NavigationContainer>
            <Drawer.Navigator
                initialRouteName="SubstitutionPlan"
                drawerStyle={styles.drawer}

                drawerContent={CustomDrawerContent}
            >
                <Drawer.Screen
                    name="SubstitutionPlan"
                    options={{ title: "Vertretungsplan", drawerIcon: SubstitutionPlanIcon }}
                    component={SubstitutionScreen}
                />
                <Drawer.Screen
                    name="Tasks"
                    options={{ title: "Aufgaben", drawerIcon: TasksIcon }}
                    component={TasksScreen}
                />
                <Drawer.Screen
                    name="ClassTests"
                    options={{ title: "Arbeiten", drawerIcon: ClassTestsIcon }}
                    component={ClassTestsScreen}
                />
                <Drawer.Screen
                    name="Birthdays"
                    options={{ title: "Geburtstage", drawerIcon: BirthdayIcon }}
                    component={BirthdaysScreen}
                />
                <Drawer.Screen
                    name="Settings"
                    options={{ title: "Einstellungen", drawerIcon: SettingsIcon }}
                    component={SettingsScreen}
                />
                <Drawer.Screen
                    name="Login"
                    options={{ title: "Anmelden", swipeEnabled: false }}
                    component={LoginScreen}
                />
                <Drawer.Screen
                    name="Menu"
                    options={{ title: "Menü", swipeEnabled: false }}
                    component={MenuScreen}
                />
            </Drawer.Navigator>
        </NavigationContainer>

    );
};

