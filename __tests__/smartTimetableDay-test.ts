/**
 * @format
 */

import 'react-native';
import smartTimetableDay from '../src/helpers/smartTimetableDay';

it('monday, 11:00', () => {
  let result = smartTimetableDay(new Date('2022-04-18T11:00:00Z'));
  expect(result).toBe(1); // monday
});

it('monday, 20:00', () => {
  let result = smartTimetableDay(new Date('2022-04-18T20:00:00Z'));
  expect(result).toBe(2); // tuesday
});

it('tuesday, 11:00', () => {
  let result = smartTimetableDay(new Date('2022-04-19T11:00:00Z'));
  expect(result).toBe(2); // tuesday
});

it('tuesday, 20:00', () => {
  let result = smartTimetableDay(new Date('2022-04-19T20:00:00Z'));
  expect(result).toBe(3); // wednesday
});

it('wednesday, 5:00', () => {
  let result = smartTimetableDay(new Date('2022-04-20T05:00:00Z'));
  expect(result).toBe(3); // wednesday
});

it('wednesday, 23:59', () => {
  let result = smartTimetableDay(new Date('2022-04-20T23:59:00Z'));
  expect(result).toBe(4); // thursday
});

it('thursday, 10:00', () => {
  let result = smartTimetableDay(new Date('2022-04-21T10:00:00Z'));
  expect(result).toBe(4); // thursday
});

it('thursday, 22:00', () => {
  let result = smartTimetableDay(new Date('2022-04-21T22:00:00Z'));
  expect(result).toBe(5); // friday
});

it('friday, 10:00', () => {
  let result = smartTimetableDay(new Date('2022-04-22T10:00:00Z'));
  expect(result).toBe(5); // friday
});

it('friday, 20:00', () => {
  let result = smartTimetableDay(new Date('2022-04-22T20:00:00Z'));
  expect(result).toBe(1); // monday
});

it('saturday, 14:00', () => {
  let result = smartTimetableDay(new Date('2022-04-23T14:00:00Z'));
  expect(result).toBe(1); // monday
});

it('sunday, 1:00', () => {
  let result = smartTimetableDay(new Date('2022-04-24T01:00:00Z'));
  expect(result).toBe(1); // monday
});
