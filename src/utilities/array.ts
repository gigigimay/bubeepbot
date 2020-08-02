import fp from 'lodash/fp'

type CreateArrayResolver<T> = (value: T, index: number, array: T[]) => T

/**
 * @param {(value, index: number, array: any[]) => result} create
 * a callback function that return value of each array element
 */
export const createArray = <T>(
  create: CreateArrayResolver<T> | T = fp.identity,
  initialValue?: T
) => (length = 0): T[] => {
  // create empty array of length and fill with initialValue
  const arr: T[] = Array(length).fill(initialValue)

  // loop through the array and assign value to the array (mutate)
  arr.forEach((value, index, array) => {
    if (create instanceof Function) {
      const result = create(value, index, array)
      // eslint-disable-next-line no-param-reassign
      array[index] = result
    } else {
      // eslint-disable-next-line no-param-reassign
      array[index] = create
    }
  })
  return arr
}

export const asyncForEach = async <T>(
  array: T[],
  callback: (value: T, index: number, array: T[]) => any
) => {
  for (let index = 0; index < array.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[index], index, array)
  }
}
