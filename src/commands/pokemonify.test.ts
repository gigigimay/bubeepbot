import { createPokemonID, nameToNumber } from './pokemonify'

const getRandomInt = (max: number) => Math.floor(Math.random() * Math.floor(max))

describe('nameToNumber', () => {
  it('should return number calculated from string', () => {
    expect(typeof nameToNumber('a')).toBe('number')
    expect(typeof nameToNumber('b')).toBe('number')
  })
  it('should give same result if name is the same', () => {
    expect(nameToNumber('a')).toEqual(nameToNumber('a'))
  })
})

describe('createPokemonID', () => {
  const max = 806
  const username = 'username'
  describe('fixed case number', () => {
    it(`discriminator = 1, output should be in range [0 - ${max}]`, () => {
      const discriminator = 1
      const result = createPokemonID({ discriminator, username }, max)
      expect(result).toBeLessThanOrEqual(max)
      expect(result).toBeGreaterThanOrEqual(0)
    })
    it(`discriminator = -1, output should be in range [0 - ${max}]`, () => {
      const discriminator = -1
      const result = createPokemonID({ discriminator, username }, max)
      expect(result).toBeLessThanOrEqual(max)
      expect(result).toBeGreaterThanOrEqual(0)
    })
    it(`discriminator = 0, output should be in range [0 - ${max}]`, () => {
      const discriminator = 0
      const result = createPokemonID({ discriminator, username }, max)
      expect(result).toBeLessThanOrEqual(max)
      expect(result).toBeGreaterThanOrEqual(0)
    })
    it(`discriminator = max, output should be in range [0 - ${max}]`, () => {
      const discriminator = max
      const result = createPokemonID({ discriminator, username }, max)
      expect(result).toBeLessThanOrEqual(max)
      expect(result).toBeGreaterThanOrEqual(0)
    })
  })
  describe('random int', () => {
    Array.from(Array(10)).forEach(() => {
      const discriminator = getRandomInt(9999)
      const result = createPokemonID({ discriminator, username }, max)
      it(`discriminator = ${discriminator}, output should be in range [0 - ${max}]`, () => {
        expect(result).toBeLessThanOrEqual(max)
        expect(result).toBeGreaterThanOrEqual(0)
      })
    })
  })
})
