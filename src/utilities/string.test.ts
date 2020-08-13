import {
  withStar, parseCommand, clean, beep, exampleCommand,
} from './string'

describe('withStar', () => {
  it('should return string wrapped in star', () => {
    expect(withStar('beep')).toBe('\\*beep\\*')
  })
  it('should return "" if string is empty', () => {
    expect(withStar()).toBe('')
  })
})

describe('clean', () => {
  it('should trim and remove duplicate whitespaces', () => {
    expect(clean('abc ')).toBe('abc')
    expect(clean(' abc')).toBe('abc')
    expect(clean('a bc')).toBe('a bc')
    expect(clean('a b   c')).toBe('a b c')
  })
  it('should return empty string', () => {
    expect(clean()).toBe('')
    expect(clean('')).toBe('')
  })
})

describe('parseCommand', () => {
  it('should return command name and param when input have both', () => {
    expect(parseCommand('!echo eiei')).toEqual({ name: 'echo', param: 'eiei' })
    expect(parseCommand('!echo eiei za')).toEqual({ name: 'echo', param: 'eiei za' })
  })
  it('should return only command name when input does not have param', () => {
    expect(parseCommand('!echo')).toEqual({ name: 'echo', param: undefined })
  })
  it('should return undefined when input is not command', () => {
    expect(parseCommand('hello')).toEqual(undefined)
  })
})

describe('beep', () => {
  it('should match snapshots', () => {
    expect(beep()).toMatchSnapshot()
    expect(beep('eiei')).toMatchSnapshot()
  })
})

describe('exampleCommand', () => {
  it('should match snapshots', () => {
    expect(exampleCommand('eiei')).toMatchSnapshot()
  })
})
