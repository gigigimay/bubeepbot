import { Message, VoiceConnection, StringResolvable } from 'discord.js'

export interface CommandExecutionArgs {
  message: Message
  param?: string
}

export type CommandExecution = (args: CommandExecutionArgs) => void

export type WithVoiceChannelCallback = (args: {
  message: Message
  param?: string
  connection: VoiceConnection
}) => Promise<void>

export type WithVoiceChannelCheckBeforeJoin = (
  args: CommandExecutionArgs
) => StringResolvable

export type CommandExecutionWithVoiceChannel = (
  callback: WithVoiceChannelCallback,
  options?: {
    /** error message to reply when user is not in a voice channel. */
    noConnectionError?: StringResolvable
    /**
     * `checkBeforeJoin` - a callback function that execute before join.
     * if the function returns false, command will end and bot will not join channel. */
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

export interface TarotCard {
  value_int: number
  name: string
  meaning_up: string
  meaning_rev: string
}

export interface PokemonType {
  name: string
  url: string
}

export interface Pokemon {
  name: string
  sprite: string
  types: PokemonType[]
  id: number
  color: string
}
