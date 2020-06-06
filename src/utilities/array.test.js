import { createArray } from './array'

describe('createArray', () => {
  describe('when create array with a value', () => {
    it('should return array of that value', () => {
      const getArray = createArray(1)
      expect(getArray(3)).toEqual([1, 1, 1])
    })
  })
  describe('when create array with no parameter', () => {
    it('should return array of undefined', () => {
      const getArray = createArray()
      expect(getArray(2)).toEqual([undefined, undefined])
    })
  })
  describe('when create array with a function', () => {
    it('should return array of the result from function', () => {
      const getArray = createArray(() => 1)
      expect(getArray(3)).toEqual([1, 1, 1])
    })
    it('[fibonacci] should be able to access index and current array in the callback', () => {
      const fibonacci = createArray((_value, index, array) => {
        if (index < 2) return 1
        return array[index - 1] + array[index - 2]
      })
      expect(fibonacci(10)).toEqual([1, 1, 2, 3, 5, 8, 13, 21, 34, 55])
    })
  })
  describe('when create array with a function and initial value', () => {
    it('should set initial value of array', () => {
      const getArray = createArray(undefined, 1)
      expect(getArray(3)).toEqual([1, 1, 1])
    })
    it('[index + sum]', () => {
      const getArray = createArray((_value, index, array) => index + array.reduce((a, b) => a + b, 0), 0)
      expect(getArray(5)).toEqual([0, 1, 3, 7, 15])
    })
  })
})
