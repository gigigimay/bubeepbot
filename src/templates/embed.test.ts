import embed from './embed'

describe('embed', () => {
  it('should return embed object with overridden values', () => {
    expect(embed({ title: 'x' }).title).toBe('x')
  })
  it('should be able to remove some default values', () => {
    expect(embed({ footer: undefined }).footer).toBe(undefined)
  })
})
