import { Message, VoiceChannel, VoiceConnection } from 'discord.js'

export type CommandExecution = (param: { message: Message, param?: string }) => void

export type CommandExecutionJoinVoiceChannel = (param: {connection:VoiceConnection, message: Message, param?: string }) => void

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

export interface TarotCard{
  value_int: number
  name: string
  meaning_up: string
  meaning_rev: string
}

export interface PokemonType{
  name: string
  url: string
}

export interface Pokemon{
  name:string
  sprite:string
  types: PokemonType[]
  id:number
  color:string
}
