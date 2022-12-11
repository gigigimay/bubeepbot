import _ from 'lodash'
import { checkLanguageValid, getGender, getVoiceLineNational } from './../helper/tts'
import { Command, CommandParamType, InteractionWithVoiceChannelCallback, InteractionWithVoiceChannelCheckBeforeJoin, WithVoiceChannelCallback, WithVoiceChannelCheckBeforeJoin } from '../types'
import { beep, exampleCommand } from '../utilities/string'

import { interactionWithVoiceChannel, withVoiceChannel } from '../helper/execute'
import { getAuthorNickname as interactionGetAuthorNickname } from '../helper/interaction'
import { getAuthorUsername } from '../helper/message'
import { createMemoryInstance } from '../helper/memory'
import { playSound } from '../helper/connection'

const DEFAULT_GENDER = 'female'
const DEFAULT_LANG = 'th'

interface SayMemory {
  gender?: string
  lang?: string
}

const memoryConfig = {
  gender: getGender,
  lang: checkLanguageValid,
}

const { memory, saveMemory } = createMemoryInstance<SayMemory>(memoryConfig)

const emptyParamError = [
  beep('Please tell bubeep what to *say*.'),
  exampleCommand('say goodnight'),
]

const execute: WithVoiceChannelCallback = async ({ connection, param, message }) => {
  const username = getAuthorUsername(message)
  const lang = memory[username]?.lang ?? DEFAULT_LANG
  const gender = memory[username]?.gender ?? DEFAULT_GENDER
  const url = getVoiceLineNational(lang, gender, param!)
  await playSound(connection, url)
}

const interactionExecute: InteractionWithVoiceChannelCallback = async ({ connection, interaction }) => {
  const param = interaction.options.getString('word')
  const name = interactionGetAuthorNickname(interaction)

  const username = interaction.member?.user.username as string
  const lang = memory[username]?.lang ?? DEFAULT_LANG
  const gender = memory[username]?.gender ?? DEFAULT_GENDER
  const url = getVoiceLineNational(lang, gender, param!)
  interaction.reply(`**${name}** said: "${param}"`)
  await playSound(connection, url)
}

const checkBeforeJoin: WithVoiceChannelCheckBeforeJoin = async ({ param, message }) => {
  if (!param) return emptyParamError

  const username = getAuthorUsername(message)
  const result = await saveMemory(param, username, memoryConfig)
  if (result) return result
}

const interactionCheckBeforeJoin: InteractionWithVoiceChannelCheckBeforeJoin = (interaction) => {
  if (!interaction.options) return emptyParamError
}

const command: Command = {
  name: 'say',
  desc: 'I say.',
  param: CommandParamType.Required,
  options: [
    {
      name: 'word',
      description: 'something you want bubeep to say',
      isRequired: true
    }
  ],
  execute: withVoiceChannel(execute, { checkBeforeJoin }),
  interactionExecute: interactionWithVoiceChannel(interactionExecute, { checkBeforeJoin: interactionCheckBeforeJoin }),
  withVoiceChannel: true,
}

export default command
