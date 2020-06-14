import fp from 'lodash/fp'
import embed from '../templates/embed'
import { prefix } from '../../config.json'
import { getCommand } from '../helper/command'

const paramWord = {
  0: 'none',
  1: 'optional',
  2: 'required',
}

const commandDataConfig = [
  { key: 'desc', name: 'Description' },
  {
    key: 'cooldown', name: 'Cooldown', inline: true, transform: c => `${c} second${c > 1 ? 's' : ''}`,
  },
  {
    key: 'param', name: 'Parameter', inline: true, transform: v => paramWord[v],
  },
  {
    key: 'aliases', name: 'Aliases', inline: true, transform: fp.join(', '),
  },
]

const transformCommand = (config = [], command = {}) => fp.pipe(
  fp.map(({ transform, ...f }) => {
    const v = fp.get(f.key)(command)
    const value = transform ? transform(v) : v
    return v && { ...f, value }
  }),
  fp.compact,
)(config)

const execute = (message, param = '') => {
  if (param) {
    const command = getCommand(param, message)
    if (command) {
      const commandData = transformCommand(commandDataConfig, command)
      message.channel.send(embed({
        thumbnail: null,
        footer: null,
        timestamp: null,
        author: { name: 'bubeep command:' },
        title: command.name,
        fields: commandData,
      }))
      return
    }
  }
  const commands = message.client.commands.map(c => `\`${c.name}\` - ${c.desc}`)
  message.channel.send(embed({
    thumbnail: null,
    footer: null,
    timestamp: null,
    title: 'Command list',
    description: [
      ...commands,
      '',
      `You can type \`${prefix}help <command>\``,
      'if you feel like getting to know me more. :white_heart:',
    ].join('\n'),
  }))
}

export default {
  name: 'help',
  desc: 'Show all the command bubeep knows!',
  param: 1, // 0: no param, 1: optional, 2: required
  execute,
}
