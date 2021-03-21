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

type MemoryConfig = IIndexable<(v: string) => string | Promise<string>>
const setT: MemoryConfig = {
  gender: getGender,
  lang: checkLanguageValid,
  else: (v) => v
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

const createCheckSet = async (
  param: string,
  username: string,
  memoryConfig: MemoryConfig
) => {
  const params = param.split(' ')
  if (params.length === 2 && params[0].startsWith(`--`) && memoryConfig[params[0]]) {
    const key = params[0]
    const value: string = await memoryConfig[params[0]](params[1])

    _.set(memory, `${username}.${key}`, value)
    return [[`[${username}] ${key}:`, value].join(' ')]
  }

}

const checkBeforeJoin: WithVoiceChannelCheckBeforeJoin = async ({ param, message }) => {
  if (!param) return emptyParamError

  const username = getAuthorUsername(message)
  const result = await createCheckSet(param, username, setT)
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
