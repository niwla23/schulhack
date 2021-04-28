"use strict"

import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle, ScrollView, Pressable, Linking, Alert, RefreshControl } from 'react-native';
import { Tag } from '../components/tag';
import { useTheme } from '../theme/themeprovider';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { IservWrapper } from '../iservscrapping';
import ListError from '../components/listError';
import { IservFile } from '../iservscrapping/types';
import HTML from "react-native-render-html";
import { Switch } from 'react-native-gesture-handler';
import Button from "../components/button"


export default function TaskDetailsScreen({ navigation, route }) {
  const { colors } = useTheme();

  function getTagContent(text: String) {
    if (text === "true") {
      return <FontAwesome5 style={{ fontSize: 18 }} name="check" />
    } else if (text === "false") {
      return <FontAwesome5 style={{ fontSize: 18 }} name="times" />
    } else {
      return text
    }
  }

  interface Style {
    background: ViewStyle;
    contentContainer: ViewStyle;
    subHeader: TextStyle;
    text: TextStyle;
    filesContainer: ViewStyle;
    fileContainer: ViewStyle;
    fileWrapper: ViewStyle;
    fileIcon: ViewStyle;
    openIservButtonContainer: ViewStyle;
    confirmationContainer: ViewStyle;
  }
  const styles = StyleSheet.create<Style>({
    background: {
      backgroundColor: colors.background,
      height: "100%",
    },
    contentContainer: {
      padding: 20,
      paddingTop: 10,
    },
    subHeader: {
      fontSize: 20,
      color: colors.text,
      paddingTop: 16
    },
    text: {
      color: colors.text
    },
    fileContainer: {
      width: "50%",
      height: "auto",
    },
    fileWrapper: {
      backgroundColor: colors.background2,
      margin: 5,
      padding: 5
    },
    filesContainer: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "stretch"

    },
    fileIcon: {
      color: colors.text,
      fontSize: 100,
      textAlign: "center"
    },
    openIservButtonContainer: {
      marginBottom: 10,
      marginTop: 10
    },
    confirmationContainer: {
      display: 'flex',
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16
    }
  })

  const [task, setTask] = useState
    ({
      id: 0,
      title: "Titel",
      from: "Max Mustermann",
      start: new Date,
      end: new Date,
      description: "Hier ist die Beschreibung\nhallo\nhdsajdhsjd",
      providedFiles: [],
      done: false,
      type: "upload",
      feedback: false,
      uploadedFiles: [],
      uploadedText: "",
      feedbackText: ""
    })

  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [doneToggle, setDoneToggle] = useState(false)

  function loadTask() {
    setLoaded(false)
    setLoading(true)
    setError("")
    const iserv: IservWrapper = new IservWrapper
    iserv.init().then(() => {
      iserv.getTaskDetails(route.params.task.id).then(fetchedTask => {
        if (fetchedTask) {
          fetchedTask.title = route.params.task.original.task
          fetchedTask.done = route.params.task.original.done
          fetchedTask.feedback = route.params.task.original.feedback
          fetchedTask.start = route.params.task.original.start
          fetchedTask.end = route.params.task.original.end
          fetchedTask.id = route.params.task.original.id
          fetchedTask.url = `${iserv.iserv?.url}/iserv/exercise/show/${fetchedTask.id}`
          setTask(fetchedTask)
          setDoneToggle(task.done)
          setLoaded(true)
        } else {
          setError("Parsing error")
        }
        setLoading(false)
      })
        .catch(e => {
          setError(e.toString())
          setLoading(false)
          Alert.alert("Parsing / task get error", e.toString())
        })

    }).catch(e => {
      setError(e.toString())
      setLoading(false)
    })
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      'focus',
      loadTask
    );

    return () => {
      unsubscribe();
    };
  }, [loadTask]);
  return (
    <View style={styles.background}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadTask} />
        }
      >
        {loaded &&
          <View style={styles.contentContainer}>
            <Text onPress={loadTask}>
              <Tag header="Von" content={task.from}></Tag>
              <Tag header="Fertig" content={getTagContent(task.done.toString())}></Tag>
              <Tag header="Feedback" content={getTagContent(task.feedback.toString())}></Tag>
              <Tag header="Start" content={task.start.toLocaleString().slice(0, -3)}></Tag>
              <Tag header="Abgabe" content={task.end.toLocaleString().slice(0, -3)}></Tag>


            </Text>
            <View style={styles.openIservButtonContainer}>
              <Button text="In Iserv öffnen" onPress={() => {
                Linking.openURL(task.url)

              }} />
            </View>

            <HTML
              baseFontStyle={styles.text}
              ignoredStyles={['color']}
              source={{ html: task.description }}
            />
            {task.providedFiles.length > 0 &&
              <View>
                <Text style={styles.subHeader}>Bereitgestellte Dateien</Text>
                <View style={styles.filesContainer}>
                  {task.providedFiles.map((file: IservFile, index) =>
                    <View key={index} style={styles.fileContainer}>
                      <Pressable android_ripple={{ color: colors.background }} onPress={() => {


                        const iserv: IservWrapper = new IservWrapper
                        iserv.init().then(() => {
                          if (file.url && file.name) {
                            iserv.downloadFile(file.url.toString(), file.name.toString())
                            Alert.alert("Download gestartet", "Schau in deine Benachrichtigungen")
                          }
                        })

                      }} style={styles.fileWrapper}>
                        <FontAwesome5 name="file-alt" solid style={styles.fileIcon}></FontAwesome5>
                        <Text style={styles.text}>{file.name} ({file.size})</Text>
                      </Pressable>
                    </View>
                  )}

                </View>
              </View>
            }

            {task.type === "upload" &&
              <View>
                <Text style={styles.subHeader}>Abgegebene Dateien</Text>
                <View style={styles.filesContainer}>
                  {task.uploadedFiles.map((file: IservFile, index) =>
                    <View key={index} style={styles.fileContainer}>
                      <Pressable android_ripple={{ color: colors.background }} onPress={() => {
                        const iserv: IservWrapper = new IservWrapper
                        iserv.init().then(() => {
                          if (file.url && file.name) {
                            iserv.downloadFile(file.url.toString(), file.name.toString())
                            Alert.alert("Download gestartet", "Schau in deine Benachrichtigungen")
                          }
                        })
                      }} style={styles.fileWrapper}>
                        <FontAwesome5 name="file-alt" solid style={styles.fileIcon}></FontAwesome5>
                        <Text style={styles.text}>{file.name} ({file.size})</Text>
                      </Pressable>
                    </View>
                  )}

                </View>
              </View>
            }
            {task.type === "text" &&
              <View>
                <Text style={styles.subHeader}>Abgegebener Text</Text>
                <HTML
                  baseFontStyle={styles.text}
                  ignoredStyles={['color']}
                  source={{ html: task.uploadedText }}
                />
              </View>

            }
            {task.type === "confirmation" &&
              <View style={styles.confirmationContainer}>
                <Text style={styles.text}>Erledigt</Text>

                <Switch
                  trackColor={{ false: '#767577', true: colors.secondary }}
                  thumbColor={colors.primary}
                  onValueChange={(value) => {
                    setDoneToggle(value)
                    const iserv: IservWrapper = new IservWrapper
                    iserv.init().then(() => {
                      iserv.setTaskDoneState(task.id, value).then(state => {
                        const tempTask = Object.assign(task)
                        tempTask.done = value
                        setTask(tempTask)
                        Alert.alert("Status gesetzt!")
                      })
                    })
                  }}
                  value={doneToggle}
                // style={styles.daySwitch}
                />
              </View>

            }
            {task.feedbackText &&
              <View>
                <Text style={styles.subHeader}>Feedback</Text>
                <HTML
                  baseFontStyle={styles.text}
                  source={{ html: task.feedbackText }}
                  ignoredStyles={['color']}
                />
              </View>
            }




          </View>
        }
        {loading && error === "" &&
          <ListError icon={"clock"} error={"Wird geladen"} />
        }
        {!loaded && error !== "" &&
          <ListError icon={"bug"} error={error} />
        }


      </ScrollView>
    </View>
  );
}