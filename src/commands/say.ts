import _ from 'lodash'
import { checkLanguageValid, getGender, getVoiceLineNational } from './../helper/tts'
import { Command, CommandParamType, IIndexable, WithVoiceChannelCallback, WithVoiceChannelCheckBeforeJoin } from '../types'
import { beep, exampleCommand } from '../utilities/string'

import { withVoiceChannel } from '../helper/execute'
import { getAuthorUsername } from '../helper/message'

const DEFAULT_GENDER = 'female'
const DEFAULT_LANG = 'th'

const memory: IIndexable = {}

const emptyParamError = [
  beep('Please tell bubeep what to *say*.'),
  exampleCommand('say goodnight'),
]

type MemoryGetValue = ((v: string) => string | Promise<string>) | null

type MemoryConfig = IIndexable<MemoryGetValue>
const memoryConfig: MemoryConfig = {
  gender: getGender,
  lang: checkLanguageValid,
  else: null,
}

const execute: WithVoiceChannelCallback = async ({ connection, param, message }) => {
  if (param) {
    const username = getAuthorUsername(message)
    const lang = _.get(memory, `${username}.lang`, DEFAULT_LANG)
    const gender = _.get(memory, `${username}.gender`, DEFAULT_GENDER)
    const url = await getVoiceLineNational(lang, gender, param)
    connection.play(url)
  }
}

const saveMemory = async (
  param: string,
  username: string,
  config: MemoryConfig,
): Promise<string[] | undefined> => {
  const params = param.split(' ')
  const key = params[0]
  const getValue = config[key]
  if (params.length === 2 && key.startsWith('--') && getValue !== undefined) {
    const rawValue = param[1]
    const value: string = getValue ? await getValue(rawValue) : rawValue
    _.set(memory, `${username}.${key}`, value)
    return [[`[${username}] ${key}:`, value].join(' ')]
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
