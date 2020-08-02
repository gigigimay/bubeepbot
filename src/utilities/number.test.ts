import { getRandomInt, getNotDuplicatedRandomNumbers } from './number'

const expectNum = (result: number, max = 0, min = 0) => {
  expect(result).toBeLessThanOrEqual(max)
  expect(result).toBeGreaterThanOrEqual(min)
}

const repeat = (times: number, fn: (index: number) => any) => {
  Array(times).fill(null).forEach((_, index) => fn(index))
}

const isDuplicated = (array: any[]) => {
  const countResult: { [k: number]: any } = {}
  array.forEach(v => {
    if (!countResult[v]) {
      countResult[v] = 1
    } else {
      countResult[v] += 1
    }
  })
  return !!Object.values(countResult).find(v => v > 1)
}

describe('getRandomInt', () => {
  describe('with max and min', () => {
    const max = 10
    const min = 1
    repeat(10, () => {
      const result = getRandomInt(max, min)
      it(`(${max}, ${min}) => ${result}`, () => {
        expectNum(result, max, min)
      })
    })
  })
  describe('min = undefined', () => {
    const max = 10
    const min = undefined
    repeat(10, () => {
      const result = getRandomInt(max, min)
      it(`(${max}, ${min}) => ${result}`, () => {
        expectNum(result, max, min)
      })
    })
  })
  describe('max = undefined, min = undefined', () => {
    const max = undefined
    const min = undefined
    const result = getRandomInt(max, min)
    it(`(${max}, ${min}) => 0`, () => {
      expect(result).toBe(0)
    })
  })
  describe('max < min', () => {
    const max = 1
    const min = 10
    it('should throw error', () => {
      expect(() => getRandomInt(max, min)).toThrow('max must be more than min!')
    })
  })
})

describe('getNotDuplicatedRandomNumbers', () => {
  describe('when call function with params', () => {
    it('should return array of non duplicated num', () => {
      const amount = 22
      const result = getNotDuplicatedRandomNumbers(22)(amount)
      expect(result).toHaveLength(amount)
      expect(isDuplicated(result)).toBe(false)
    })
  })
  describe('when amount is more than number range', () => {
    it('should throw error', () => {
      const amount = 10
      expect(() => getNotDuplicatedRandomNumbers(5, 10)(amount)).toThrow('amount need to be less than (max - min)')
    })
  })
})
