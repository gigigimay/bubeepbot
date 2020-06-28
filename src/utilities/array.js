import fp from 'lodash/fp'

/**
 * @param {(value, index: number, array: any[]) => result} create
 * a callback function that return value of each array element
 */
export const createArray = (create = fp.identity, initialValue) => (length = 0) => {
  // create empty array of length and fill with initialValue
  const arr = Array(length).fill(initialValue)

  // loop through the array and assign value to the array (mutate)
  arr.forEach((value, index, array) => {
    if (typeof create === 'function') {
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

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[index], index, array)
  }
}
