import fp from 'lodash/fp'
import { EmbedField } from 'discord.js'

import { CommandExecution, Command, CommandParamType } from './../types'
import config from '../config'
import Commands, { getCommand } from '../helper/command'
import embed from '../templates/embed'

const { prefix } = config

interface CommandDataConfig {
  key: string
  name: string
  inline?: boolean
  transform?: (value: any) => string
}

const commandDataConfig: CommandDataConfig[] = [
  { key: 'desc', name: 'Description' },
  {
    key: 'cooldown', name: 'Cooldown', inline: true, transform: (c: number) => `${c} second${c > 1 ? 's' : ''}`,
  },
  {
    key: 'param', name: 'Parameter', inline: true,
  },
  {
    key: 'aliases', name: 'Aliases', inline: true, transform: fp.join(', '),
  },
]

const transformCommand = (config: CommandDataConfig[], command: Command): EmbedField[] => fp.pipe(
  fp.map(({ transform, ...f }) => {
    const v = fp.get(f.key)(command)
    const value = transform ? transform(v) : v
    return v && { ...f, value }
  }),
  fp.compact,
)(config)

const execute: CommandExecution = ({ message, param = '' }) => {
  if (param) {
    const command = getCommand(param)
    if (command) {
      const commandData = transformCommand(commandDataConfig, command)
      message.channel.send({
        embeds: [embed({
          thumbnail: undefined,
          footer: undefined,
          timestamp: undefined,
          author: { name: 'bubeep command:' },
          title: command.name,
          fields: commandData,
        })],
      })
      return
    }
  }
  const commands = Commands.map((c) => `\`${c.name}\` - ${c.desc}`)
  message.channel.send({
    embeds: [embed({
      thumbnail: undefined,
      footer: undefined,
      timestamp: undefined,
      title: 'Command list',
      description: [
        ...commands,
        '',
        `You can type \`${prefix}help <command>\``,
        'if you feel like getting to know me more. :white_heart:',
      ].join('\n'),
    })],
  })
}

const command: Command = {
  name: 'help',
  desc: 'Show all the command bubeep knows!',
  param: CommandParamType.Optional,
  execute,
}

export default command
