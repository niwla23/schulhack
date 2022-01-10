'use strict';

import {
  Text,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
  Task,
  Pressable,
} from 'react-native';
import React from 'react';
import {Tag} from './tag';
import {useTheme} from '../theme/themeprovider';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';

const keys_to_labels = {
  start: 'Start',
  end: 'Abgabe',
  done: 'Erledigt',
  feedback: 'Rückmeldung',
  tags: 'Tags',
};

export const TaskItem = (props) => {
  const {colors, isDark} = useTheme();

  interface Style {
    itemContainer: ViewStyle;
    itemTitle: TextStyle;
    itemContent: TextStyle;
    detailsContainer: ViewStyle;
    detailsText: TextStyle;
    detailsIcon: ViewStyle;
  }
  const styles = StyleSheet.create<Style>({
    itemContainer: {
      marginTop: 16,
      backgroundColor: colors.background2,
      borderRadius: 8,
      padding: 20,
      paddingBottom: 10,
      elevation: 0,
    },
    itemTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
    },
    itemContent: {
      marginTop: 8,

      fontSize: 18,
      fontWeight: '400',
      color: colors.text,
    },
    detailsContainer: {
      alignSelf: 'flex-end',
      padding: 10,
      margin: 0,
    },
    detailsText: {
      textAlign: 'right',
      color: colors.text,
      fontSize: 18,
    },
    detailsIcon: {
      margin: 10,
    },
  });

  function getTagContent(input: any) {
    if (input === 'true') {
      return <FontAwesome5 style={{fontSize: 18}} name="check" />;
    } else if (input === 'false') {
      return <FontAwesome5 style={{fontSize: 18}} name="times" />;
    } else if ((input as Date).getDay) {
      return dayjs().to(dayjs(input));
    } else {
      return input;
    }
  }

  const navigation = useNavigation();

  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{props.content.title}</Text>
      <Text style={styles.itemContent}>
        {Object.keys(props.content).map(
          (propertyName, index) =>
            props.content[propertyName] !== props.course && (
              <Tag
                key={index}
                header={keys_to_labels[propertyName]}
                content={getTagContent(props.content[propertyName])}
              />
            ),
        )}
      </Text>
      <Pressable
        onPress={() => {
          // navigation.navigate("Tasks", { task: props.content, screen: "TaskDetails" })
          navigation.navigate('App', {
            screen: 'Tasks',
            params: {screen: 'TaskDetails', params: {task: props.content}},
          });
        }}
        style={styles.detailsContainer}
        android_ripple={{color: colors.background, borderless: false}}>
        <Text style={styles.detailsText}>
          Details <FontAwesome5 name="arrow-right" style={styles.detailsIcon} />
        </Text>
      </Pressable>
    </View>
  );
};

export default TaskItem;
