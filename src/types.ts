import { Message } from 'discord.js'

export type CommandExecution = (param: { message: Message, param?: string }) => void

export interface Command {
  name: string
  desc?: string
  /** 0: no param, 1: optional, 2: required */
  param: 0 | 1 | 2
  execute: CommandExecution
  aliases?: string[]
}

export interface ParsedCommand {
  name: string
  param?: string
}
