import AsyncStorage from '@react-native-async-storage/async-storage';
import {Lesson} from '../types/timetable';

export default async (data_to_serialize: Lesson[][]) => {
  data_to_serialize.map(async (day, dayIndex) => {
    day.map(async (lesson, lessonIndex) => {
      await AsyncStorage.setItem(
        `timetable.${dayIndex}.${lessonIndex}`,
        JSON.stringify({
          teacher: lesson.teacher,
          subject: lesson.subject,
          room: lesson.room,
          day: dayIndex,
          hour: lessonIndex,
        }),
      );
    });
  });
};
