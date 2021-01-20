import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import { AppearanceProvider } from 'react-native-appearance';
import { ThemeProvider, useTheme } from './theme/themeprovider';

import { Navigation } from './navigation'

import SubstitutionScreen from "./screens/substitutionplan"
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

const App = () => {
  const { colors, isDark } = useTheme();
  const styles = StyleSheet.create({
    drawer: {
      backgroundColor: colors.background,
      width: "100%"
    },
  });

  const [theme, setTheme] = useState("system")

  useEffect(() => {
    AsyncStorage.getItem("@theme").then(read_value => {
        if (read_value) {
            setTheme(read_value)
        }
    })
}, []);

  return (
    <AppearanceProvider>
      <ThemeProvider theme={theme}>
        <Navigation />
      </ThemeProvider>
    </AppearanceProvider>

  );
};



export default App;
