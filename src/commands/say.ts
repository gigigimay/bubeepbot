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

enum SetType {
  Gender = 'gender',
  Language = 'lang'
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

const checkType = async (username: string, param: string) => {
  const params = param.split(' ')
  if (params.length === 2) {
    const type = params[0].replace('--', '')
    const value = params[1]

    var saveValue: string

    switch (`${type}`) {
      case SetType.Gender:
        saveValue = getGender(value)
        break
      case SetType.Language:
        saveValue = await checkLanguageValid(value)
        break
      default:
        return
    }

    _.set(memory, `${username}.${type}`, saveValue)
    return [[`[${username}] ${type}:`, value].join(' ')]

  }

}

const checkBeforeJoin: WithVoiceChannelCheckBeforeJoin = async ({ param, message }) => {
  if (!param) return emptyParamError

  const username = getAuthorUsername(message)
  return checkType(username, param)
}

const command: Command = {
  name: 'say',
  desc: 'I say.',
  param: CommandParamType.Required,
  execute: withVoiceChannel(execute, { checkBeforeJoin }),
  withVoiceChannel: true,
}

export default command
