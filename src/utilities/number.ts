import { createArray } from './array'

export const getRandomInt = (max = 0, min = 0, inclusive = true) => {
  if (max < min) throw new Error('max must be more than min!')
  const maxInt = Math.round(max)
  const minInt = Math.floor(min)
  const inclusiveInt = inclusive ? 1 : 0
  return Math.floor(Math.random() * (maxInt - minInt + inclusiveInt)) + minInt
}

export const getNotDuplicatedRandomNumbers = (max = 0, min = 0, inclusive = true) => (amount: number): number[] => {
  if (amount > Math.abs(max - min)) throw new Error('amount need to be less than (max - min)!')
  return createArray<number>((_value, _index, array) => {
    do {
      const num = getRandomInt(max, min, inclusive)
      if (!array.includes(num)) return num
      // eslint-disable-next-line no-constant-condition
    } while (true)
  })(amount)
}
