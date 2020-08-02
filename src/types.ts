import { Message, VoiceConnection, StringResolvable } from 'discord.js'

export type CommandExecutionArgs = { message: Message, param?: string }

export type CommandExecution = (args: CommandExecutionArgs) => void

export type WithVoiceChannelCallback = {
  message: Message
  param?: string
  connection: VoiceConnection
}

export type WithVoiceChannelCheckBeforeJoin = (args: CommandExecutionArgs) => StringResolvable

export type CommandExecutionWithVoiceChannel = (
  callback: (args: WithVoiceChannelCallback) => Promise<void>,
  options?: {
    noConnectionError?: StringResolvable
    checkBeforeJoin?: WithVoiceChannelCheckBeforeJoin
  }
) => CommandExecution

export interface Command {
  name: string
  desc?: string
  /** 0: no param, 1: optional, 2: required */
  param: 0 | 1 | 2
  execute: CommandExecution
  aliases?: string[]
  cooldown?: number
  withVoiceChannel?: boolean
}

export interface ParsedCommand {
  name: string
  param?: string
}
