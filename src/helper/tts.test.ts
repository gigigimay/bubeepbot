import { Gender, getGender } from './tts'

describe('getGender', () => {
  it('should return female', () => {
    expect(getGender('female')).toEqual(Gender.Female)
    expect(getGender('f')).toEqual(Gender.Female)
  })
  it('should return male', () => {
    expect(getGender('male')).toEqual(Gender.Male)
    expect(getGender('m')).toEqual(Gender.Male)
  })
  it('should throw error when called with invalid gender', () => {
    expect(() => getGender('')).toThrow('invalid gender!')
    expect(() => getGender('xxx')).toThrow('invalid gender!')
  })
})
