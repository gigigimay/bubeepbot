/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import fs from 'fs'
import Discord from 'discord.js'
import { withStar } from './utilities/string'

const commands = new Discord.Collection()

const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(file => file.match(/^\w+(?!test)\.js$/))

commandFiles.forEach(file => {
  const command = require(`./commands/${file}`).default
  commands.set(command.name, command)
})

export default ({ name, param }, message) => {
  if (!commands.has(name)) {
    return message.channel.send(`${withStar('BUBEEP')} Did you cast a wrong spell? :face_with_raised_eyebrow:`)
  }
  try {
    commands.get(name).execute(message, param)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    message.channel.send([
      `${withStar('BUBEEP')} Mr.Stark, I don't feel so good. :nauseated_face:`,
      '```',
      e.message,
      '```',
    ])
  }
}
