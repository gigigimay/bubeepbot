import fp from 'lodash/fp'
import { EmbedField } from 'discord.js'

import { CommandExecution, Command } from './../types'
import { prefix } from '../config.json'
import Commands, { getCommand } from '../helper/command'
import embed from '../templates/embed'

const paramWord: { [k: number]: string } = {
  0: 'none',
  1: 'optional',
  2: 'required',
}

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
    key: 'param', name: 'Parameter', inline: true, transform: (v: number) => paramWord[v],
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
  const commands = Commands.map((c) => `\`${c.name}\` - ${c.desc}`)
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

const command: Command = {
  name: 'help',
  desc: 'Show all the command bubeep knows!',
  param: 1,
  execute,
}

export default command
