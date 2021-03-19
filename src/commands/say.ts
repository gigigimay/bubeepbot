import _ from 'lodash'
import { checkLanguageValid, getGender, getVoiceLineNational } from './../helper/tts'
import { Command, IIndexable, WithVoiceChannelCallback, WithVoiceChannelCheckBeforeJoin } from '../types'
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

const checks: Array<[string, (v: string) => string | Promise<string>]> = [
  ['gender', getGender],
  ['lang', checkLanguageValid],
]

const execute: WithVoiceChannelCallback = async ({ connection, param, message }) => {
  if (param) {
    const username = getAuthorUsername(message)
    const lang = _.get(memory, `${username}.lang`, DEFAULT_LANG)
    const gender = _.get(memory, `${username}.gender`, DEFAULT_GENDER)
    const url = await getVoiceLineNational(lang, gender, param)
    connection.play(url)
  }
}

const createCheckSet = (
  param: string,
  username: string,
) => async (
  key: string,
  getValue?: (v: string) => string | Promise<string>,
) => {
  const params = param.split(' ')
  if (params.length === 2) {
    if (params[0] === `--${key}`) {
      const value = getValue ? await getValue(params[1]) : params[1]
      _.set(memory, `${username}.${key}`, value)
      return [[`[${username}] ${key}:`, value].join(' ')]
    }
  }
}

const checkBeforeJoin: WithVoiceChannelCheckBeforeJoin = async ({ param, message }) => {
  if (!param) return emptyParamError

  const username = getAuthorUsername(message)
  const checkSet = createCheckSet(param, username)
  for (const check of checks) {
    const result = await checkSet(check[0], check[1])
    if (result) return result
  }
}

const command: Command = {
  name: 'say',
  desc: 'I say.',
  param: 2,
  execute: withVoiceChannel(execute, { checkBeforeJoin }),
  withVoiceChannel: true,
}

export default command
