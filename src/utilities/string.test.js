import { withStar, parseCommand } from './string'

describe('withStar', () => {
  it('should return string wrapped in star', () => {
    expect(withStar('beep')).toEqual('\\*beep\\*')
  })
  it('should return undefined if string is empty', () => {
    expect(withStar()).toEqual(undefined)
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
  it('should return null when input is not command', () => {
    expect(parseCommand('hello')).toEqual(null)
  })
})
