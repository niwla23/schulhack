/* eslint-disable dot-notation */
import React, {useEffect, useState} from 'react';
import DeviceInfo from 'react-native-device-info';
import {AppearanceProvider} from 'react-native-appearance';
import {ThemeProvider} from './theme/themeprovider';
import {Navigation} from './navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UpdateOverlay} from './components/updateOverlay';
import axios from 'axios';
import {Alert, Linking} from 'react-native';
import compareVersions from './helpers/compareVersions';

const App = () => {
  const [theme, setTheme] = useState('');
  const [showUpdateOverlay, setShowUpdateOverlay] = useState(false);
  const [releaseNotes, setReleaseNotes] = useState(['lol']);
  const [newVersionName, setNewVersionName] = useState('');
  const [updateUrl, setUpdateUrl] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('@theme').then((read_value) => {
      if (read_value) {
        setTheme(read_value);
      } else {
        setTheme('dark');
      }
    });
    if (
      process.env['ENABLE_AUTO_UPDATE'] &&
      process.env['UPDATE_SERVER_BASE_URL']
    ) {
      const currentVersion: number[] = [];
      DeviceInfo.getVersion()
        .split('.')
        .forEach((element) => {
          currentVersion.push(Number(element));
        });
      if (currentVersion.length === 2) {
        currentVersion.push(0);
      }

      const abi = DeviceInfo.supportedAbisSync()[0];
      const url = process.env['UPDATE_SERVER_BASE_URL'];

      axios.get(url).then((r) => {
        let latestRelease: any = null;
        let currentElement = 0;
        while (!latestRelease) {
          let element = r.data[currentElement];
          if (
            !element.prerelease ||
            process.env['ALLOW_PRERELEASES'] === 'true'
          ) {
            latestRelease = element;
          }
          currentElement += 1;
        }

        let latestVersion: number[] = [];
        latestRelease.name
          .slice(1)
          .split('.')
          .forEach((element: string) => {
            latestVersion.push(Number(element));
          });

        if (latestVersion.length === 2) {
          latestVersion.push(0);
        }

        console.log('current version', currentVersion);
        console.log('latest version', latestVersion);
        console.log('latest release', latestRelease);

        let updateAvailable = compareVersions(currentVersion, latestVersion);
        if (updateAvailable) {
          setReleaseNotes(latestRelease.body.split('\n'));

          latestRelease.assets.forEach((element: any) => {
            if (element.name.split('_')[2] === abi) {
              setUpdateUrl(element.browser_download_url);
            }
          });
        }
        setShowUpdateOverlay(updateAvailable);
      });
    }
  }, []);

  const acceptUpdate = () => {
    Alert.alert(
      'Browser schließen',
      'Bitte schließe den Browser, bevor du das update runterlädst',
      [
        {
          text: 'Hab ich gemacht',
          onPress: () => {
            Linking.openURL(updateUrl);
          },
        },
      ],
    );
  };

  return (
    <AppearanceProvider>
      {theme !== '' && (
        <ThemeProvider theme={theme}>
          <Navigation />
          {showUpdateOverlay && (
            <UpdateOverlay
              releaseNotes={releaseNotes}
              versionName={newVersionName}
              onAccept={acceptUpdate}
              onCancel={() => {
                setShowUpdateOverlay(false);
              }}
            />
          )}
        </ThemeProvider>
      )}
    </AppearanceProvider>
  );
};

export default App;
