import _ from 'lodash'
import { getGender, getVoiceLineNational } from './../helper/tts'
import { Command, IIndexable, WithVoiceChannelCallback, WithVoiceChannelCheckBeforeJoin } from '../types'
import { beep, exampleCommand } from '../utilities/string'

import { withVoiceChannel } from '../helper/execute'
import { getAuthorUsername } from '../helper/message'

const memory: IIndexable = {}

const emptyParamError = [
  beep('Please tell bubeep what to *say*.'),
  exampleCommand('say goodnight'),
]

const execute: WithVoiceChannelCallback = async ({ connection, param, message }) => {
  if (param) {
    const username = getAuthorUsername(message)
    const lang = _.get(memory, `${username}.lang`, 'th')
    const gender = _.get(memory, `${username}.gender`, 'female')
    connection.play(getVoiceLineNational(lang, gender, param))
  }
}

const checkBeforeJoin: WithVoiceChannelCheckBeforeJoin = ({ param, message }) => {
  console.log('param', param)
  console.log('message', message)

  if (param) {
    const username = getAuthorUsername(message)
    const params = param.split(' ')
    if (params.length === 2) {
      if (params[0] === '--set-gender') {
        const gender = getGender(params[1])
        _.set(memory, `${username}.gender`, gender)
        console.log('\n\nmemory!!!!', memory)

        return [['Gender set:', username, gender].join(' ')]
      }

      if (params[0] === '--set-lang') {
        const lang = params[1]
        _.set(memory, `${username}.lang`, lang)
        console.log('\n\nmemory!!!!', memory)
        return [['Language set:', username, lang].join(' ')]
      }
    }
  }

  return !param && emptyParamError
}

const command: Command = {
  name: 'say',
  desc: 'I say.',
  param: 2,
  execute: withVoiceChannel(execute, { checkBeforeJoin }),
  withVoiceChannel: true,
}

export default command
