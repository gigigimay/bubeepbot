import { createPokemonID } from './pokemonify'

const getRandomInt = max => Math.floor(Math.random() * Math.floor(max))


describe('createPokemonID', () => {
  const max = 806
  describe('fixed case number', () => {
    it(`discriminator = 1, output should be in range [0 - ${max}]`, () => {
      const discriminator = 1
      expect(createPokemonID({ discriminator }, max)).toBeLessThanOrEqual(max)
      expect(createPokemonID({ discriminator }, max)).toBeGreaterThanOrEqual(0)
    })
    it(`discriminator = -1, output should be in range [0 - ${max}]`, () => {
      const discriminator = -1
      expect(createPokemonID({ discriminator }, max)).toBeLessThanOrEqual(max)
      expect(createPokemonID({ discriminator }, max)).toBeGreaterThanOrEqual(0)
    })
    it(`discriminator = 0, output should be in range [0 - ${max}]`, () => {
      const discriminator = 0
      expect(createPokemonID({ discriminator }, max)).toBeLessThanOrEqual(max)
      expect(createPokemonID({ discriminator }, max)).toBeGreaterThanOrEqual(0)
    })
    it(`discriminator = max, output should be in range [0 - ${max}]`, () => {
      const discriminator = max
      expect(createPokemonID({ discriminator }, max)).toBeLessThanOrEqual(max)
      expect(createPokemonID({ discriminator }, max)).toBeGreaterThanOrEqual(0)
    })
  })
  describe('random int', () => {
    Array.from(Array(10)).forEach(() => {
      const discriminator = getRandomInt(9999)
      it(`discriminator = ${discriminator}, output should be in range [0 - ${max}]`, () => {
        expect(createPokemonID({ discriminator, uesrname: 'uesrname' }, max)).toBeLessThanOrEqual(max)
        expect(createPokemonID({ discriminator, uesrname: 'uesrname' }, max)).toBeGreaterThanOrEqual(0)
      })
    })
  })
})
