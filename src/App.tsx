import React, { useEffect, useState } from 'react';
import DeviceInfo from "react-native-device-info"
import { AppearanceProvider } from 'react-native-appearance';
import { ThemeProvider } from './theme/themeprovider';
import { Navigation } from './navigation'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UpdateOverlay } from './components/updateOverlay'
import axios from "axios"
import { Linking } from 'react-native';


const App = () => {

  const [theme, setTheme] = useState("dark")
  const [showUpdateOverlay, setShowUpdateOverlay] = useState(false)
  const [releaseNotes, setReleaseNotes] = useState(["lol"])
  const [newVersionName, setNewVersionName] = useState("")
  const [updateUrl, setUpdateUrl] = useState("")

  useEffect(() => {
    AsyncStorage.getItem("@theme").then(read_value => {
      if (read_value) {
        setTheme(read_value)
      }
    })
    console.log(`foo is equal to ${process.env["FOO"]}`);

    if (Boolean(process.env["ENABLE_AUTO_UPDATE"])) {
      console.log("checking for updates")
      console.log(Number(DeviceInfo.getBuildNumber()))
      const abi = DeviceInfo.supportedAbisSync()[0]
      axios.get(`${process.env["UPDATE_SERVER_BASE_URL"]}/versions.json?cb=${new Date().getTime()}`).then(r => {


        const versionData = r.data[abi]

        setShowUpdateOverlay(versionData.versionCode > DeviceInfo.getBuildNumber())
        setNewVersionName(versionData.versionName)
        console.log(versionData.url)
        setUpdateUrl(versionData.url)

        axios.get(`${process.env["UPDATE_SERVER_BASE_URL"]}/release_notes.json?cb=${new Date().getTime()}`).then(b => {
          setReleaseNotes(b.data[String(versionData.simpleVersionCode)].de)
        })
      })
    }

  }, []);

  const acceptUpdate = () => {
    console.log("yay, user accepted")
    Linking.openURL(updateUrl)
  }



  return (
    <AppearanceProvider>
      <ThemeProvider theme={theme}>
        <Navigation />
        {showUpdateOverlay &&
          <UpdateOverlay
            releaseNotes={releaseNotes}
            versionName={newVersionName}
            onAccept={acceptUpdate}
            onCancel={() => { setShowUpdateOverlay(false) }}
          />
        }

      </ThemeProvider>
    </AppearanceProvider>

  );
};



export default App;
