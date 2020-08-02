jest.mock('discord.js', () => ({}))
jest.mock('./src/config.json', () => ({
  prefix: '!',
}))
