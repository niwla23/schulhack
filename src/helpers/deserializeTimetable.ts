import { Lesson } from '../types/timetable';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default async () => {
  const timetable: Lesson[][] = []
  var i = 0
  while (i < 5) {
      let d: Lesson[] = timetable[timetable.push([]) - 1]
      var j = 0
      while (j < 700) {
          let raw: string | null = await AsyncStorage.getItem(`timetable.${i}.${j}`)
          if (raw) {
              d.push(JSON.parse(raw))
          } else {
              break
          }
          j++
      }
      i++
  }
  return timetable
}