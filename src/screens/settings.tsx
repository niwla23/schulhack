"use strict"

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { TextSetting, LinkSetting, TagsSetting, SelectSetting } from '../components/settings'
import { useTheme } from '../theme/themeprovider';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';

export default function SettingsScreen({ navigation }) {
    const { colors } = useTheme();

    interface Style {
        background: ViewStyle;
        mainScrollView: ViewStyle;
    }
    const styles = StyleSheet.create<Style>({
        background: {
            backgroundColor: colors.background,
            height: "100%"
        },
        mainScrollView: {
            paddingRight: 20,
            width: "100%"
        }
    })

    return (
        <View style={styles.background}>
            <ScrollView
                contentInsetAdjustmentBehavior='automatic'
                style={styles.mainScrollView}
            >
                <LinkSetting
                    title="Abmelden"
                    value={'Melde dich von Iserv ab'}
                    onPress={() => {
                        AsyncStorage.clear();
                        RNRestart.Restart();
                    }}
                />
                <TagsSetting
                    title="Klassen / Kurse"
                    setting_name="@courses"
                    description="Die Klassen für die der Vertretungsplan angzeigt werden soll. Gib Klassen entweder mit Leerzeichen oder Komma getrennt ein. Tippe auf eine Klasse um sie zu entfernen"
                    placeholder="9f 5d"
                />
                <SelectSetting
                    title="Theme"
                    setting_name="@theme"
                    afterSelect={(_value: String) => RNRestart.Restart()}
                    options={
                        {
                            "darkOrange": "Dunkel (Orange)",
                            "darkPink": "Dunkel (Pink)",
                            "darkGreen": "Dunkel (Grün)",
                            "light": "Hell (Grün)"
                        }
                    }
                />
                <TextSetting
                    title="Pfad des aktuellen Plans"
                    setting_name="@currentPlanPath"
                    description="Der Pfad des Vertretungsplans für den aktuellen Tag. Du findest diesen durch einen Rechtsklick bzw. langes drücken auf den Vertretungsplan > Frame > Nur diesen Frame anzeigen (oder ähnlich Option). Dann wählst du alles aus der Addressleiste aus, außer der Servername, also z.B. ohne https://example.org"
                    placeholder="/iserv/plan/show/raw/01-Vertreter Schüler heute/subst_001.htm"
                />
                <TextSetting
                    title="Pfad des nächsten Plans"
                    setting_name="@nextPlanPath"
                    description="Der Pfad des Vertretungsplans für den nächsten Tag. Du findest diesen durch einen Rechtsklick bzw. langes drücken auf den Vertretungsplan > Frame > Nur diesen Frame anzeigen (oder ähnlich Option). Dann wählst du alles aus der Addressleiste aus, außer der Servername, also z.B. ohne https://example.org"
                    placeholder="/iserv/plan/show/raw/02-Vertreter Schüler morgen/subst_002.htm"
                />
                <LinkSetting
                    title="Über diese App"
                    value="Impressum, Datenschutz, Haftungsauschluss"
                    onPress={() => {
                        navigation.navigate('Info');
                    }}
                />
            </ScrollView>
        </View>
    );
}