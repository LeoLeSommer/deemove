import {find, indexOf} from 'lodash';

/**
 * Create or update an element in an array
 *
 * @param arr The array
 * @param predicate A find function to find witch elem to update
 * @param update A function that returns the new value, if the elem already exists, it's passed as an argument
 */
export function upsert<T>(
  arr: T[],
  predicate: (elem: T) => boolean,
  update: (previous?: T) => T,
) {
  const result = [...arr];

  const match = find(result, predicate);
  if (match) {
    const index = indexOf(result, find(result, predicate));
    result.splice(index, 1, update(match));
  } else {
    result.push(update());
  }

  return result;
}
