'use strict';

import { Text, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import React from 'react';
import { Tag } from './tag'
import { useTheme } from '../theme/themeprovider';


const keys_to_labels = {
    teacher: "Lehrer",
    subject: "Fach",
    course: "Kurse",
    room: "Raum",
    text: "Information"
}

export const PlanItem = (props) => {
    const { colors, isDark } = useTheme();

    interface Style {
        itemContainer: ViewStyle;
        itemTitle: TextStyle;
        itemContent: TextStyle;
    }
    const styles = StyleSheet.create<Style>({
        itemContainer: {
            marginTop: 16,
            paddingHorizontal: 24,
            backgroundColor: colors.background2,
            padding: 20
        },
        itemTitle: {
            fontSize: 24,
            fontWeight: '600',
            color: "#fff",
        },
        itemContent: {
            marginTop: 8,
            padding: 8,
            fontSize: 18,
            fontWeight: '400',
            color: "#fff",
        },
    });

    return (
        <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{props.content.time}</Text>
            <Text style={styles.itemContent}>
                {Object.keys(props.content).map((propertyName, index) =>
                    props.content[propertyName] != props.course &&
                    <Tag key={index} header={keys_to_labels[propertyName]} content={props.content[propertyName]} />
                )}
            </Text>
        </View>
    );
}



export default PlanItem;
