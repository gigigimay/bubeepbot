import { Message, CommandInteraction } from 'discord.js'
import { VoiceConnection } from '@discordjs/voice'
import { ApplicationCommandOptionType } from 'discord-api-types/v10'

export interface IIndexable<T = any> {
  [key: string]: T
}

export interface CommandExecutionArgs {
  message: Message
  param?: string
}

export type CommandExecution = (args: CommandExecutionArgs) => void
export type CommandInteractionExecution = (interaction: CommandInteraction) => void

export type WithVoiceChannelCallback = (args: {
  message: Message
  param?: string
  connection: VoiceConnection
}) => Promise<void>
export type InteractionWithVoiceChannelCallback = (args: {
  interaction: CommandInteraction
  connection: VoiceConnection
}) => Promise<void>

export type WithVoiceChannelCheckBeforeJoin = (
  args: CommandExecutionArgs
) => Promise<string | string[] | undefined> | string | string[] | undefined
export type InteractionWithVoiceChannelCheckBeforeJoin = (
  args: CommandInteraction
) => Promise<string | string[] | undefined> | string | string[] | undefined

export type CommandExecutionWithVoiceChannel = (
  callback: WithVoiceChannelCallback,
  options?: {
    /** error message to reply when user is not in a voice channel. */
    noConnectionError?: string
    /**
     * `checkBeforeJoin` - a callback function that execute before join.
     * the returned value indicates the error message
     * so if the function returns a value (not undefined), the command will end.
     * The bot will not join channel. and it will send the returned error message. */
    checkBeforeJoin?: WithVoiceChannelCheckBeforeJoin
  }
) => CommandExecution

export type CommandInteractionExecutionWithVoiceChannel = (
  callback: InteractionWithVoiceChannelCallback,
  options?: {
    /** error message to reply when user is not in a voice channel. */
    noConnectionError?: string
    /**
     * `checkBeforeJoin` - a callback function that execute before join.
     * if the function returns false, command will end and bot will not join channel. */
    checkBeforeJoin?: InteractionWithVoiceChannelCheckBeforeJoin
  }
) => CommandInteractionExecution

export enum CommandParamType {
  None = 'none',
  Optional = 'optional',
  Required = 'required',
}

export interface CommandOptionInfo {
  name: string
  description?: string
  type?: ApplicationCommandOptionType // default = String
  isRequired?: boolean // default = false
}

export interface Command {
  name: string
  desc?: string
  param: CommandParamType
  options?: CommandOptionInfo[]
  execute: CommandExecution
  interactionExecute?: CommandInteractionExecution
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
