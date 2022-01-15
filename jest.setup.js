jest.mock('discord.js', () => ({}))
jest.mock('./src/config', () => ({
  prefix: '!',
}))
