import { createPokemonID } from './pokemonify'

const getRandomInt = max => Math.floor(Math.random() * Math.floor(max))


describe('createPokemonID', () => {
  const max = 806
  describe('fixed case number', () => {
    it(`num = 1, output should be in range [0 - ${max}]`, () => {
      const num = 1
      expect(createPokemonID({ num, max })).toBeLessThanOrEqual(max)
      expect(createPokemonID({ num, max })).toBeGreaterThanOrEqual(0)
    })
    it(`num = -1, output should be in range [0 - ${max}]`, () => {
      const num = -1
      expect(createPokemonID({ num, max })).toBeLessThanOrEqual(max)
      expect(createPokemonID({ num, max })).toBeGreaterThanOrEqual(0)
    })
    it(`num = 0, output should be in range [0 - ${max}]`, () => {
      const num = 0
      expect(createPokemonID({ num, max })).toBeLessThanOrEqual(max)
      expect(createPokemonID({ num, max })).toBeGreaterThanOrEqual(0)
    })
    it(`num = max, output should be in range [0 - ${max}]`, () => {
      const num = max
      expect(createPokemonID({ num, max })).toBeLessThanOrEqual(max)
      expect(createPokemonID({ num, max })).toBeGreaterThanOrEqual(0)
    })
  })
  describe('random int', () => {
    Array.from(Array(10)).forEach(() => {
      const num = getRandomInt(9999)
      it(`num = ${num}, output should be in range [0 - ${max}]`, () => {
        expect(createPokemonID({ num, max, name: 'name' })).toBeLessThanOrEqual(max)
        expect(createPokemonID({ num, max, name: 'name' })).toBeGreaterThanOrEqual(0)
      })
    })
  })
})
