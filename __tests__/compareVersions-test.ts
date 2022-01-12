/**
 * @format
 */

import 'react-native';
import compareVersions from '../src/helpers/compareVersions';

it('compare higher major version', () => {
  let result = compareVersions([3, 2, 0], [4, 0, 1]);
  expect(result).toBe(true);
});

it('compare lower major version', () => {
  let result = compareVersions([4, 0, 1], [3, 2, 0]);
  expect(result).toBe(false);
});

it('compare higher minor version', () => {
  let result = compareVersions([3, 2, 1], [3, 3, 0]);
  expect(result).toBe(true);
});

it('compare lower minor version', () => {
  let result = compareVersions([3, 3, 0], [3, 2, 1]);
  expect(result).toBe(false);
});

it('compare higher patch version', () => {
  let result = compareVersions([3, 2, 1], [3, 2, 3]);
  expect(result).toBe(true);
});

it('compare lower patch version', () => {
  let result = compareVersions([3, 2, 3], [3, 2, 1]);
  expect(result).toBe(false);
});

it('compare higher large patch version', () => {
  let result = compareVersions([3, 2, 1], [3, 2, 44]);
  expect(result).toBe(true);
});

it('equal version', () => {
  let result = compareVersions([4, 1, 1], [4, 1, 1]);
  expect(result).toBe(false);
});
