import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ViewStyle, FlatList, TextStyle } from 'react-native';
import { useTheme } from '../theme/themeprovider';
import { BirthdayItem } from '../components/birthdayitem'
import { IservWrapper } from '../iservscrapping';
import ListError from '../components/listError';

export default function BirthdaysScreen({ navigation }) {
    const { colors, isDark } = useTheme();
    const [birthdays, setBirthdays] = useState([])

    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState("")

    function loadBirthdays() {
        setLoaded(false)
        const iserv = new IservWrapper
        iserv.init().then(() => {
            iserv.getBirthdays().then(fetchedBDays => {
                setBirthdays(fetchedBDays)
                setLoaded(true)
            })
                .catch(e => {
                    setLoaded(true)
                    setError(e.toString())
                })

        }).catch(e => {
            setLoaded(true)
            setError(e.toString())
        })
    }

    useEffect(() => {
        loadBirthdays()
    }, []);

    interface Style {
        background: ViewStyle;
        defaultText: TextStyle;
        courseHeader: TextStyle;
        noItemsFoundText: TextStyle;
        errorText: TextStyle;
        errorIcon: ViewStyle;
    }
    const styles: Style = StyleSheet.create<Style>({
        background: {
            backgroundColor: colors.background,
            height: "100%"
        },
        defaultText: {
            color: colors.text
        },

        courseHeader: {
            fontSize: 24,
            paddingLeft: 16,
            color: colors.text,
            marginTop: 16,
        },
        noItemsFoundText: {
            paddingTop: 32,
            textAlign: "center",
            color: colors.text
        },
        errorIcon: {
            color: colors.primary,
            fontSize: 100,
            textAlign: 'center',
            paddingTop: 100
        },
        errorText: {
            marginTop: 50,
            color: colors.text,
            fontSize: 20,
            textAlign: "center",
        },
    })

    const renderItem = ({ item }) => (
        <BirthdayItem highlighted={item.highlight} name={item.name} date={item.date} />
    );

    return (

        <View style={styles.background}>
            <FlatList
                data={birthdays}
                refreshing={!loaded}
                onRefresh={loadBirthdays}
                renderItem={renderItem}
                keyExtractor={item => item.name}
                ListFooterComponent={()=>{return(<View style={{height: 20}} />)}}
                ListEmptyComponent={() => {
                    if (error) {
                      return ListError({ error: error, icon: "bug" })
                    } else if (!loaded) {
                      return ListError({ error: "Wird geladen", icon: "clock" })
                    } else {
                      return ListError({ error: "Niemand hat in nächster Zeit Geburtstag", icon: "heart-broken" })
                    }
          
                  }}
            />
        </View>
    );
}