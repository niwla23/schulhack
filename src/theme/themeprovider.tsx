"use strict"

import * as React from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, darkPinkColors, darkGreenColors } from './colors';

export const ThemeContext = React.createContext({
    isDark: false,
    colors: lightColors,
    setScheme: () => { },
});

export const ThemeProvider = (props) => {
    var colorScheme = props.theme || "dark";
    const [isDark, setIsDark] = React.useState(true);
    React.useEffect(() => {
        setIsDark(colorScheme.includes("dark"))
    }, [setIsDark])



    let colors
    switch (colorScheme) {
        case "dark":
            colors = darkColors
            break
        case "light":
            colors = lightColors
            // setIsDark(false)
            break
        case "darkPink":
            colors = darkPinkColors
            break
        case "darkGreen":
            colors = darkGreenColors
            break
        default:
            colors = darkColors
    }

    const defaultTheme = {
        isDark,
        colors: colors,
        setScheme: (scheme) => setIsDark(scheme === "dark"),
    };

    return (
        <ThemeContext.Provider value={defaultTheme}>
            {props.children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => React.useContext(ThemeContext);