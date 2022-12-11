import _, { delay } from 'lodash'
import { checkLanguageValid, getGender, getVoiceLineNational } from './../helper/tts'
import { Command, CommandParamType, InteractionWithVoiceChannelCallback, InteractionWithVoiceChannelCheckBeforeJoin, WithVoiceChannelCallback, WithVoiceChannelCheckBeforeJoin } from '../types'
import { beep, exampleCommand } from '../utilities/string'

import { interactionWithVoiceChannel, withVoiceChannel } from '../helper/execute'
import { getAuthorNickname as interactionGetAuthorNickname } from '../helper/interaction'
import { getAuthorUsername } from '../helper/message'
import { createMemoryInstance } from '../helper/memory'
import { playSound } from '../helper/connection'
import { ApplicationCommandOptionType } from 'discord-api-types/v10'

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
  const word = interaction.options.get('message', true).value as string
  const username = interaction.member?.user.username as string
  const name = interactionGetAuthorNickname(interaction)
  const lang = memory[username]?.lang ?? DEFAULT_LANG
  const gender = memory[username]?.gender ?? DEFAULT_GENDER
  const url = getVoiceLineNational(lang, gender, word)
  await interaction.reply(`**${name}** says: "${word}"`)
  await playSound(connection, url)
  const isDelete = interaction.options.get('delete')?.value
  if (isDelete) {
    await delay(() => interaction.deleteReply(), 1000)
  }
}

const checkBeforeJoin: WithVoiceChannelCheckBeforeJoin = async ({ param, message }) => {
  if (!param) return emptyParamError

  const username = getAuthorUsername(message)
  const result = await saveMemory(param, username, memoryConfig)
  if (result) return result
}

const command: Command = {
  name: 'say',
  desc: 'I say.',
  param: CommandParamType.Required,
  options: [
    {
      name: 'message',
      description: 'something you want bubeep to say',
      isRequired: true
    },
    {
      name: 'delete',
      description: 'whether to delete the message after bubeep finished speaking :sunglasses:',
      type: ApplicationCommandOptionType.Boolean,
      isRequired: false
    }
  ],
  execute: withVoiceChannel(execute, { checkBeforeJoin }),
  interactionExecute: interactionWithVoiceChannel(interactionExecute),
  withVoiceChannel: true,
}

export default command
