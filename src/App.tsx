import React, { useEffect, useState } from 'react';
import { AppearanceProvider } from 'react-native-appearance';
import { ThemeProvider } from './theme/themeprovider';
import { Navigation } from './navigation'
import AsyncStorage from '@react-native-async-storage/async-storage';


const App = () => {

  const [theme, setTheme] = useState("dark")

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
