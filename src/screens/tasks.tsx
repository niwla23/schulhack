"use strict"

import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ViewStyle, SectionList, TextStyle, Alert, RefreshControl } from 'react-native';
import { useTheme } from '../theme/themeprovider';
import TaskItem from '../components/taskitem';
import { IservWrapper } from '../iservscrapping';
import ListError from '../components/listError';


export default function TasksScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const [tasks, setTasks] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [oldLoaded, setOldLoaded] = useState(false)
  const [error, setError] = useState(null)

  interface Style {
    background: ViewStyle;
    sectionHeader: TextStyle;
    sectionHeaderContainer: ViewStyle;
    sectionHeaderBadge: TextStyle;
    contentScroll: ViewStyle;
    loadMoreText: TextStyle;
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
      borderRadius: 30 / 2,
      fontSize: 16,

      textAlign: "center"
    },
    contentScroll: {
      padding: 8,
      height: "100%"
    },
    loadMoreText: {
      color: colors.text,
      paddingBottom: 32,
      paddingTop: 8,
      textAlign: "center",
      textDecorationLine: "underline"

    }
  })

  async function loadTasks(all?: Boolean) {
    setLoaded(false)
    setTasks([])
    setError(null)

    try {
      const iserv = new IservWrapper()
      await iserv.init()
      let fetchedTasks = await iserv.getTasksOverview(all)
      setTasks(fetchedTasks)
    } catch (e) {
      setError(e.toString())
    } finally {
      setLoaded(true)
    }

    if (all) { setOldLoaded(true) }
  }

  useEffect(() => {
    loadTasks()

  }, []);

  return (
    <View style={styles.background}>
      <SectionList
        contentInset={{ top: 30 }}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            progressBackgroundColor={colors.background2}
            refreshing={!loaded}
            onRefresh={loadTasks}
          />}
        sections={tasks}
        style={styles.contentScroll}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <TaskItem content={item} />}
        renderSectionHeader={({ section: { title, data } }) => (
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeader}>{title}</Text>
            <Text style={styles.sectionHeaderBadge}>{data.length}</Text>
          </View>

        )}
        ListFooterComponent={() => (
          <Text
            style={styles.loadMoreText}
            onPress={() => { loadTasks(true) }}
          >
            {loaded && !oldLoaded ? "Ältere laden" : ""}
          </Text>
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