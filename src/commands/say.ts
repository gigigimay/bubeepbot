import _ from 'lodash'
import { checkLanguageValid, getGender, getVoiceLineNational } from './../helper/tts'
import { Command, CommandParamType, WithVoiceChannelCallback, WithVoiceChannelCheckBeforeJoin } from '../types'
import { beep, exampleCommand } from '../utilities/string'

import { withVoiceChannel } from '../helper/execute'
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
  if (param) {
    const username = getAuthorUsername(message)
    const lang = memory[username]?.lang ?? DEFAULT_LANG
    const gender = memory[username]?.gender ?? DEFAULT_GENDER
    const url = getVoiceLineNational(lang, gender, param)
    await playSound(message.guildId, url)
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
  execute: withVoiceChannel(execute, { checkBeforeJoin }),
  withVoiceChannel: true,
}

export default command
