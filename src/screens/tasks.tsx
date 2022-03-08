'use strict';

import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  RefreshControl,
  Switch,
  FlatList,
} from 'react-native';
import {useTheme} from '../theme/themeprovider';
import TaskItem from '../components/taskitem';
import {IservWrapper} from '../iservscrapping';
import ListError from '../components/listError';

export default function TasksScreen({navigation}) {
  const {colors, isDark} = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [oldLoaded, setOldLoaded] = useState(false);
  const [error, setError] = useState(null);

  interface Style {
    background: ViewStyle;
    sectionHeader: TextStyle;
    sectionHeaderContainer: ViewStyle;
    sectionHeaderBadge: TextStyle;
    contentScroll: ViewStyle;
    loadMoreText: TextStyle;
    daySwitchContainer: ViewStyle;
    defaultText: TextStyle;
  }
  const styles = StyleSheet.create<Style>({
    background: {
      backgroundColor: colors.background,
      flex: 1,
      // alignItems: 'center',
      // justifyContent: 'center'
    },
    sectionHeaderContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',

      marginTop: 16,
      marginLeft: 16,
      marginRight: 16,
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

      textAlign: 'center',
    },
    contentScroll: {
      padding: 8,
      height: '100%',
    },
    loadMoreText: {
      color: colors.text,
      paddingBottom: 32,
      paddingTop: 8,
      textAlign: 'center',
      textDecorationLine: 'underline',
    },
    daySwitchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    defaultText: {
      color: colors.text,
    },
  });

  React.useLayoutEffect(() => {
    const toggleSwitch = () => setOldLoaded((previousState) => !previousState);

    navigation.setOptions({
      headerRight: () => (
        <View style={styles.daySwitchContainer}>
          <Text style={styles.defaultText}>Aktuell</Text>
          <Switch
            trackColor={{false: '#767577', true: colors.secondary}}
            thumbColor={colors.primary}
            onValueChange={toggleSwitch}
            value={oldLoaded}
          />
          <Text style={styles.defaultText}>Alte</Text>
        </View>
      ),
    });
  }, [navigation, styles, colors.secondary, colors.primary, oldLoaded]);

  async function loadTasks(all?: Boolean) {
    setLoaded(false);
    setTasks([]);
    setError(null);

    try {
      const iserv = new IservWrapper();
      await iserv.init();
      let fetchedTasks = await iserv.getTasksOverview(all);
      setTasks(fetchedTasks);
    } catch (e) {
      setError(e.toString());
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    loadTasks(oldLoaded);
  }, [oldLoaded]);

  return (
    <View style={styles.background}>
      <FlatList
        contentInset={{top: 30}}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            progressBackgroundColor={colors.background2}
            refreshing={!loaded}
            onRefresh={() => {
              loadTasks(oldLoaded);
            }}
          />
        }
        data={tasks}
        style={styles.contentScroll}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => <TaskItem content={item} />}
        ListFooterComponent={() => (
          <Text
            style={styles.loadMoreText}
            onPress={() => {
              setOldLoaded(true);
            }}>
            {loaded && !oldLoaded ? 'Ältere laden' : ''}
          </Text>
        )}
        ListEmptyComponent={() => {
          if (error) {
            return ListError({error: error, icon: 'bug'});
          } else if (!loaded) {
            return ListError({error: 'Wird geladen', icon: 'clock'});
          } else {
            return ListError({
              error: 'Du hast in letzter Zeit keine Aufgaben bekommen',
              icon: 'glass-cheers',
            });
          }
        }}
      />
    </View>
  );
}
