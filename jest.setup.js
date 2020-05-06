jest.mock('discord.js', () => ({}))
jest.mock('./config.json', () => ({
  prefix: '!',
}))
