import Discord, { Collection } from 'discord.js'

export type CommandExecution = (param: { message: Discord.Message, param?: string }) => void

export interface Command {
  name: string
  desc?: string
  /** 0: no param, 1: optional, 2: required */
  param: 0 | 1 | 2
  execute: CommandExecution
}

export interface ParsedCommand {
  name: string
  param?: string
}

export interface MyClient extends Discord.Client {
  commands?: Collection<string, Command | undefined>
}
