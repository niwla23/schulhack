"use strict"

import * as React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { lightGreenColors, whitePinkColors, darkOrangeColors, darkPinkColors, darkGreenColors } from './colors';

export const ThemeContext = React.createContext({
    isDark: false,
    colors: lightGreenColors,
    setScheme: () => { },
});

export const ThemeProvider = (props) => {
    var colorScheme = props.theme || "darkGreen";
    console.log(colorScheme)
    const [isDark, setIsDark] = React.useState(colorScheme.includes("dark"));
    React.useEffect(() => {
        setIsDark(colorScheme.includes("dark"))
    }, [setIsDark])



    let colors
    switch (colorScheme) {
        case "darkOrange":
            colors = darkOrangeColors
            break
        case "light":
            colors = lightGreenColors
            break
        case "whitePink":
            colors = whitePinkColors
            break
        case "darkPink":
            colors = darkPinkColors
            break
        case "darkGreen":
            colors = darkGreenColors
            break
        default:
            colors = darkGreenColors
    }

    const defaultTheme = {
        isDark,
        colors: colors,
        setScheme: (scheme) => setIsDark(scheme.includes("dark")),
    };
    console.log(isDark)
    return (
        <ThemeContext.Provider value={defaultTheme}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? colors.background : colors.background2}></StatusBar>
            {props.children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => React.useContext(ThemeContext);