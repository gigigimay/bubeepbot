import { getRandomInt } from './number'

const expectNum = (result, max = 0, min = 0) => {
  expect(result).toBeLessThanOrEqual(max)
  expect(result).toBeGreaterThanOrEqual(min)
}

const repeat = (times, fn) => {
  Array.from(Array(times)).forEach((_, index) => fn(index))
}

describe('getRandomInt', () => {
  describe('from > to', () => {
    const from = 10
    const to = 1
    repeat(10, () => {
      const result = getRandomInt(from, to)
      it(`(${from}, ${to}) => ${result}`, () => {
        expectNum(result, from, to)
      })
    })
  })
  describe('to > from', () => {
    const from = 1
    const to = 10
    repeat(10, () => {
      const result = getRandomInt(from, to)
      it(`(${from}, ${to}) => ${result}`, () => {
        expectNum(result, to, from)
      })
    })
  })
  describe('to = undefined', () => {
    const from = 10
    const to = undefined
    repeat(10, () => {
      const result = getRandomInt(from, to)
      it(`(${from}, ${to}) => ${result}`, () => {
        expectNum(result, from, to)
      })
    })
  })
  describe('from = undefined, to = undefined', () => {
    const from = undefined
    const to = undefined
    const result = getRandomInt(from, to)
    it(`(${from}, ${to}) => 0`, () => {
      expect(result).toBe(0)
    })
  })
})
