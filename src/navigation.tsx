/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import {useTheme} from './theme/themeprovider';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import SubstitutionScreen from './screens/substitutionplan';
import TimetableScreen from './screens/timetable';
import EditTimetableScreen from './screens/editTimetable';
import TasksScreen from './screens/tasks';
import TaskDetailsScreen from './screens/taskdetails';
import BirthdaysScreen from './screens/birthdays';
import ClasstestsScreen from './screens/classtests';
import SettingsScreen from './screens/settings';
import LoginScreen from './screens/login';
import InfoScreen from './screens/info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNBootSplash from 'react-native-bootsplash';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import {BottomDrawer} from './components/bottomDrawer';

const Stack = createStackNavigator();
const SubstitutionPlanStack = createStackNavigator();
const TaskStack = createStackNavigator();
const BirthdaysStack = createStackNavigator();
const ClasstestsStack = createStackNavigator();
const TimetableStack = createStackNavigator();
const SettingsStack = createStackNavigator();
const Tab = createBottomTabNavigator();

export interface Props {}

const SubstitutionPlanNavigation: React.FC<Props> = (props) => {
  return (
    <SubstitutionPlanStack.Navigator headerMode="screen">
      <SubstitutionPlanStack.Screen
        name="Main"
        options={{title: 'Vertretungsplan'}}
        component={SubstitutionScreen}
      />
    </SubstitutionPlanStack.Navigator>
  );
};

const TasksNavigation: React.FC<Props> = (props) => {
  return (
    <TaskStack.Navigator headerMode="screen" headerTintColor="#fff">
      <TaskStack.Screen
        name="Tasks"
        options={{title: 'Aufgaben - ALPHA'}}
        component={TasksScreen}
      />
      <TaskStack.Screen
        name="TaskDetails"
        options={{title: 'Aufgabendetails'}}
        component={TaskDetailsScreen}
      />
    </TaskStack.Navigator>
  );
};

const BirthdaysNavigation: React.FC<Props> = (props) => {
  return (
    <BirthdaysStack.Navigator headerMode="screen">
      <BirthdaysStack.Screen
        name="Main"
        options={{title: 'Geburtstage'}}
        component={BirthdaysScreen}
      />
    </BirthdaysStack.Navigator>
  );
};

const ClasstestsNavigation: React.FC<Props> = (props) => {
  return (
    <ClasstestsStack.Navigator headerMode="screen">
      <ClasstestsStack.Screen
        name="Main"
        options={{title: 'Klausuren'}}
        component={ClasstestsScreen}
      />
    </ClasstestsStack.Navigator>
  );
};

const TimetableNavigation: React.FC<Props> = (props) => {
  return (
    <TimetableStack.Navigator headerMode="screen">
      <TimetableStack.Screen
        name="Main"
        options={{title: 'Stundenplan'}}
        component={TimetableScreen}
      />
      <TimetableStack.Screen
        name="Edit"
        options={{title: 'Bearbeiten'}}
        component={EditTimetableScreen}
      />
    </TimetableStack.Navigator>
  );
};

const SettingsNavigation: React.FC<Props> = (props) => {
  return (
    <SettingsStack.Navigator headerMode="screen">
      <SettingsStack.Screen
        name="Main"
        options={{title: 'Einstellungen'}}
        component={SettingsScreen}
      />
    </SettingsStack.Navigator>
  );
};

const AppNavigation: React.FC<Props> = (props) => {
  const {colors, isDark} = useTheme();
  const styles = StyleSheet.create({
    icon: {
      color: colors.text,
      fontSize: 22,
      margin: 16,
      textAlign: 'center',
    },
  });

  function CustomTabBar({state, descriptors, navigation}) {
    const focusedOptions = descriptors[state.routes[state.index].key].options;
    const [showBottomDrawer, setShowBottomDrawer] = useState(false);

    if (focusedOptions.tabBarVisible === false) {
      return null;
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: colors.background2,
          justifyContent: 'space-around',
          alignItems: 'center',
          alignContent: 'center',
          alignSelf: 'center',
          width: '100%',
          padding: 8,
        }}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              if (index === 4) {
                setShowBottomDrawer(true);
              } else {
                navigation.navigate(route.name);
              }
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
            iconName = 'tasks';
          } else if (route.name === 'Classtests') {
            iconName = 'vial';
          } else if (route.name === 'Timetable') {
            iconName = 'calendar-week';
          } else if (route.name === 'Settings') {
            iconName = 'ellipsis-h';
          }

          if (index === 2) {
            return (
              <TouchableOpacity
                key={index + 'center'}
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                  backgroundColor: colors.primary,
                  bottom: 0,
                  borderRadius: 160,
                  padding: 4,
                  margin: 10,
                  marginRight: 25,
                  marginLeft: 25,
                  transform: [{scale: 2.1}, {translateY: -6}],
                  borderColor: colors.background2,
                  borderWidth: 3,
                }}>
                <FontAwesome5
                  name={iconName}
                  style={[styles.icon, {margin: 0}]}
                />
              </TouchableOpacity>
            );
          } else if (index < 4) {
            return (
              <TouchableOpacity
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                  flex: 1,
                  backgroundColor: isFocused
                    ? colors.secondary
                    : colors.background,
                  borderRadius: 16,
                  margin: 5,
                }}>
                <FontAwesome5 name={iconName} style={styles.icon} />
              </TouchableOpacity>
            );
          }
        })}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{}}
          accessibilityLabel={'Menu'}
          onPress={() => {
            setShowBottomDrawer(true);
          }}
          style={{
            flex: 1,
            backgroundColor: colors.background,
            borderRadius: 16,
            margin: 5,
          }}>
          <FontAwesome5 name={'ellipsis-h'} style={styles.icon} />
        </TouchableOpacity>
        <BottomDrawer
          visible={showBottomDrawer}
          items={[
            {key: 'Settings', text: 'Einstellungen'},
            {key: 'Birthdays', text: 'Geburtstage'},
            {key: 'cancel', text: 'Schließen'},
          ]}
          onSelect={(selected) => {
            setShowBottomDrawer(false);
            if (selected !== 'cancel') {
              setTimeout(() => {
                navigation.navigate(selected);
              }, 10);
            }
          }}
        />
      </View>
    );
  }

  return (
    <>
      <Tab.Navigator
        initialRouteName="SubstitutionPlan"
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'SubstitutionPlan') {
              iconName = 'exchange-alt';
            } else if (route.name === 'Tasks') {
              iconName = 'tasks';
            } else if (route.name === 'Birthdays') {
              iconName = 'birthday-cake';
            } else if (route.name === 'Settings') {
              iconName = 'cog';
            }

            return <FontAwesome5 name={iconName} style={styles.icon} />;
          },
        })}
        tabBarOptions={{
          inactiveBackgroundColor: colors.background,
          activeBackgroundColor: colors.primary,
          showLabel: false,
        }}>
        <Tab.Screen name="Timetable" component={TimetableNavigation} />
        <Tab.Screen
          name="Tasks"
          options={{tabBarBadge: 3}}
          component={TasksNavigation}
        />
        <Tab.Screen
          name="SubstitutionPlan"
          component={SubstitutionPlanNavigation}
        />
        <Tab.Screen name="Classtests" component={ClasstestsNavigation} />
        <Tab.Screen name="Birthdays" component={BirthdaysNavigation} />
        <Tab.Screen name="Settings" component={SettingsNavigation} />
      </Tab.Navigator>
    </>
  );
};

export const Navigation: React.FC<Props> = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('@intro_shown').then((intro_shown) => {
      if (!intro_shown) {
        setIsLoggedIn(false);
      }

      RNBootSplash.hide({fade: false});
    });
  }, []);

  const {colors, isDark} = useTheme();

  // Invisible screens go here
  const stackContent = isLoggedIn ? (
    <>
      <Stack.Screen name="App" component={AppNavigation} />
      <Stack.Screen name="Info" component={InfoScreen} />
    </>
  ) : (
    <>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        initialParams={{setIsLoggedIn: setIsLoggedIn}}
      />
      <Stack.Screen name="Info" component={InfoScreen} />
    </>
  );

  const Theme = {
    dark: isDark,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.background2,
      text: colors.text,
      border: colors.background,
      notification: colors.secondary,
    },
  };
  return (
    <NavigationContainer theme={Theme}>
      <Stack.Navigator headerMode="none">{stackContent}</Stack.Navigator>
    </NavigationContainer>
  );
};
