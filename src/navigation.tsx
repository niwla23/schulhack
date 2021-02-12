import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { useTheme } from './theme/themeprovider';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import SubstitutionScreen from "./screens/substitutionplan"
import TasksScreen from "./screens/tasks"
import TaskDetailsScreen from "./screens/taskdetails"
import BirthdaysScreen from "./screens/birthdays"
import SettingsScreen from "./screens/settings"
import LoginScreen from './screens/login';
import InfoScreen from './screens/info'
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNBootSplash from "react-native-bootsplash";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator();
const SubstitutionPlanStack = createStackNavigator();
const TaskStack = createStackNavigator();
const BirthdaysStack = createStackNavigator();
const SettingsStack = createStackNavigator();
const Tab = createBottomTabNavigator();

export interface Props { }

const SubstitutionPlanNavigation: React.FC<Props> = (props) => {
    return (
        <SubstitutionPlanStack.Navigator
            headerMode="screen"
        >
            <SubstitutionPlanStack.Screen
                name="Main"
                options={{ title: 'Vertretungsplan' }}
                component={SubstitutionScreen}
            />

        </SubstitutionPlanStack.Navigator>
    )
}

const TasksNavigation: React.FC<Props> = (props) => {
    return (
        <TaskStack.Navigator
            headerMode="screen"
            headerTintColor="#fff"
        >
            <TaskStack.Screen name="Tasks" options={{ title: 'Aufgaben' }} component={TasksScreen} />
            <TaskStack.Screen name="TaskDetails" options={{ title: 'Aufgabendetails' }} component={TaskDetailsScreen} />

        </TaskStack.Navigator>
    )
}

const BirthdaysNavigation: React.FC<Props> = (props) => {
    return (
        <BirthdaysStack.Navigator
            headerMode="screen"
        >
            <BirthdaysStack.Screen
                name="Main"
                options={{ title: 'Geburtstage' }}
                component={BirthdaysScreen}
            />

        </BirthdaysStack.Navigator>
    )
}

const SettingsNavigation: React.FC<Props> = (props) => {
    return (
        <SettingsStack.Navigator
            headerMode="screen"
        >
            <SettingsStack.Screen
                name="Main"
                options={{ title: 'Einstellungen' }}
                component={SettingsScreen}
            />

        </SettingsStack.Navigator>
    )
}




const AppNavigation: React.FC<Props> = (props) => {
    const { colors, isDark } = useTheme();
    const styles = StyleSheet.create({
        icon: {
            color: colors.text,
            fontSize: 22,
            margin: 16,
            textAlign: "center"
        }
    })

    function CustomTabBar({ state, descriptors, navigation }) {
        const focusedOptions = descriptors[state.routes[state.index].key].options;

        if (focusedOptions.tabBarVisible === false) {
            return null;
        }

        return (
            <View style={{
                flexDirection: 'row',
                backgroundColor: colors.background,
                justifyContent: "space-around",
                alignItems: "center",
                alignContent: "center",
                alignSelf: "center",
                width: "100%",

            }}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    let iconName;

                    if (route.name === 'SubstitutionPlan') {
                        iconName = 'exchange-alt';
                    } else if (route.name === 'Tasks') {
                        iconName = "tasks";
                    } else if (route.name === 'Birthdays') {
                        iconName = "birthday-cake";
                    } else if (route.name === 'Settings') {
                        iconName = "cog";
                    }

                    return (
                        <TouchableOpacity
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={{
                                flex: 1,
                                backgroundColor: isFocused ? colors.primary : colors.background,
                                borderRadius: 8,
                                margin: 5
                            }}
                        >
                            <FontAwesome5 name={iconName} style={styles.icon}></FontAwesome5>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    }

    return (
        <Tab.Navigator
            tabBar={props => <CustomTabBar {...props} />}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'SubstitutionPlan') {
                        iconName = 'exchange-alt';
                    } else if (route.name === 'Tasks') {
                        iconName = "tasks";
                    } else if (route.name === 'Birthdays') {
                        iconName = "birthday-cake";
                    } else if (route.name === 'Settings') {
                        iconName = "cog";
                    }

                    return <FontAwesome5 name={iconName} style={styles.icon}></FontAwesome5>;
                },
            })}

            tabBarOptions={{
                inactiveBackgroundColor: colors.background,
                activeBackgroundColor: colors.primary,
                showLabel: false,

            }}
        >
            <Tab.Screen name="SubstitutionPlan" component={SubstitutionPlanNavigation} />
            <Tab.Screen name="Tasks" options={{ tabBarBadge: 3 }} component={TasksNavigation} />
            <Tab.Screen name="Birthdays" component={BirthdaysNavigation} />
            <Tab.Screen name="Settings" component={SettingsNavigation} />
        </Tab.Navigator >
    )
}

export const Navigation: React.FC<Props> = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(true)

    useEffect(() => {
        AsyncStorage.getItem("@intro_shown").then(intro_shown => {
            if (!intro_shown) {
                setIsLoggedIn(false)
            }

            RNBootSplash.hide({ fade: false });
        })

    }, []);


    const { colors, isDark } = useTheme();

    // Invisible screens go here
    const stackContent = isLoggedIn ?
        <>
            <Stack.Screen name="App" component={AppNavigation} />
            <Stack.Screen name="Info" component={InfoScreen} />
        </> :
        <>
            <Stack.Screen name="Login" component={LoginScreen} initialParams={{ setIsLoggedIn: setIsLoggedIn }} />
            <Stack.Screen name="Info" component={InfoScreen} />

        </>

    const Theme = {
        dark: isDark,
        colors: {
            primary: colors.primary,
            background: colors.background,
            card: colors.background3,
            text: colors.text,
            border: colors.background,
            notification: colors.secondary,
        },
    };
    return (
        <NavigationContainer theme={Theme}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background}></StatusBar>
            <Stack.Navigator headerMode="none">
                {stackContent}

            </Stack.Navigator>
        </NavigationContainer>

    );
};

