import { Message, VoiceConnection, StringResolvable } from 'discord.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IIndexable<T = any> {
  [key: string]: T
}

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
) => Promise<string | string[] | undefined> | string | string[] | undefined

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

export enum CommandParamType {
  None = 'none',
  Optional = 'optional',
  Required = 'required',
}

export interface Command {
  name: string
  desc?: string
  param: CommandParamType
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
