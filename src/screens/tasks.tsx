"use strict"

import React, { useEffect, useState } from 'react';
import { Button, Text, View, StyleSheet, ViewStyle, SectionList, TextStyle, Alert } from 'react-native';
import { useTheme } from '../theme/themeprovider';
import TaskItem from '../components/taskitem';
import { Header } from '../components/header'
import { IservWrapper } from '../iservscrapping';
import ListError from '../components/listError';


export default function TasksScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const [tasks, setTasks] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(null)

  interface Style {
    background: ViewStyle;
    sectionHeader: TextStyle;
    contentScroll: ViewStyle;
  }
  const styles = StyleSheet.create<Style>({
    background: {
      backgroundColor: colors.background,
      flex: 1,
      // alignItems: 'center',
      // justifyContent: 'center'
    },
    sectionHeader: {
      color: colors.text,
      fontSize: 23,
      padding: 0,
      marginTop: 16,
      marginLeft: 16
    },
    contentScroll: {
      padding: 8,
      height: "100%"
    }
  })

  function loadTasks() {
    setLoaded(false)
    const iserv = new IservWrapper
    iserv.init().then(() => {
      iserv.getTasksOverview().then(fetchedTasks => setTasks(fetchedTasks))
        .catch(e => {
          setError(e.toString())
        })
      setLoaded(true)
    }).catch(e => {
      setError(e.toString())
    })
  }

  useEffect(() => {
    loadTasks()

  }, []);

  return (
    <View style={styles.background}>
      <Header title="Aufgaben" openDrawer={navigation.openDrawer} />
      <SectionList
        contentInset={{ top: 30 }}
        onRefresh={() => { loadTasks() }}
        refreshing={!loaded}
        sections={tasks}
        style={styles.contentScroll}
        keyExtractor={(item, index) => item + index}
        // renderItem={({ item }) => <Text style={{ color: "#fff" }}>{item.toString()}</Text>}
        renderItem={({ item }) => <TaskItem content={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        ListEmptyComponent={() => {
          if (error) {
            return ListError({ props: { error: error, icon: "bug" } })
          } else if (!loaded) {
            return <></>
          } else {
            return ListError({ props: { error: "Du hast in letzter Zeit keine Aufgaben bekommen", icon: "glass-cheers" } })
          }

        }}
      />
    </View>
  );
}