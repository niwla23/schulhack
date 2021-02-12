"use strict"

import React, { useEffect, useState } from 'react';
import { Button, Text, View, StyleSheet, ViewStyle, SectionList, TextStyle, Alert } from 'react-native';
import { useTheme } from '../theme/themeprovider';
import TaskItem from '../components/taskitem';
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
    sectionHeaderContainer: ViewStyle;
    sectionHeaderBadge: TextStyle;
    contentScroll: ViewStyle;
  }
  const styles = StyleSheet.create<Style>({
    background: {
      backgroundColor: colors.background,
      flex: 1,
      // alignItems: 'center',
      // justifyContent: 'center'
    },
    sectionHeaderContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      
      marginTop: 16,
      marginLeft: 16,
      marginRight: 16
    },
    sectionHeader: {
      color: colors.text,
      fontSize: 23,

    },
    sectionHeaderBadge: {
      color: colors.text,
      backgroundColor: colors.primary,
      padding: 4,
      width: 30,
      height: 30,
      borderRadius: 30/2,
      fontSize: 16,
      
      textAlign: "center"
    },
    contentScroll: {
      padding: 8,
      height: "100%"
    }
  })

  function loadTasks() {
    setLoaded(false)
    setTasks([])
    setError(null)
    const iserv = new IservWrapper
    iserv.init().then(() => {
      iserv.getTasksOverview().then(fetchedTasks => {
        setTasks(fetchedTasks)
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
    loadTasks()

  }, []);

  return (
    <View style={styles.background}>
      <SectionList
        contentInset={{ top: 30 }}
        onRefresh={() => { loadTasks() }}
        refreshing={!loaded}
        sections={tasks}
        style={styles.contentScroll}
        ListFooterComponent={()=>{return(<View style={{height: 20}} />)}}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <TaskItem content={item} />}
        renderSectionHeader={({ section: { title, data } }) => (
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeader}>{title}</Text>
            <Text style={styles.sectionHeaderBadge}>{data.length}</Text>
          </View>

        )}
        ListEmptyComponent={() => {
          if (error) {
            return ListError({ error: error, icon: "bug" })
          } else if (!loaded) {
            return ListError({ error: "Wird geladen", icon: "clock" })
          } else {
            return ListError({ error: "Du hast in letzter Zeit keine Aufgaben bekommen", icon: "glass-cheers" })
          }

        }}
      />
    </View>
  );
}