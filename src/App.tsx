import React, { useEffect, useState } from 'react';
import DeviceInfo from "react-native-device-info"
import { AppearanceProvider } from 'react-native-appearance';
import { ThemeProvider } from './theme/themeprovider';
import { Navigation } from './navigation'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UpdateOverlay } from './components/updateOverlay'
import axios from "axios"
import { Linking } from 'react-native';
import getSimpleVersionCode from './helpers/getSimpleVersionCode'


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

    if (Boolean(process.env["ENABLE_AUTO_UPDATE"])) {
      console.log("checking for updates")
      const currentVersionCode = Number(DeviceInfo.getBuildNumber())
      const abi = DeviceInfo.supportedAbisSync()[0]
      axios.get(`${process.env["UPDATE_SERVER_BASE_URL"]}/versions.json?cb=${new Date().getTime()}`).then(r => {
        const versionData = r.data[abi]

        setShowUpdateOverlay(versionData.versionCode > currentVersionCode)
        setNewVersionName(versionData.versionName)
        setUpdateUrl(versionData.url)

        axios.get(`${process.env["UPDATE_SERVER_BASE_URL"]}/release_notes.json?cb=${new Date().getTime()}`).then(b => {
          const missedVersions = []
          for (var i = currentVersionCode; i <= versionData.versionCode; i++) {
            missedVersions.push(i);
          }
          if (missedVersions.length > 1) {
            missedVersions.shift()
          }

          const localReleaseNotes: Array<string> = []
          missedVersions.forEach((element) => {
            const simpleVersionCode = getSimpleVersionCode(element, abi)
            b.data[String(simpleVersionCode)].de.forEach(line => {
              localReleaseNotes.push(line)
            });
          })

          // setReleaseNotes(b.data[String(versionData.simpleVersionCode)].de)
          setReleaseNotes(localReleaseNotes)
        })
      })
    }

  }, []);

  const acceptUpdate = () => {
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
