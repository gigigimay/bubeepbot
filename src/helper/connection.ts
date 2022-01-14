import fp from 'lodash/fp'
import { createAudioPlayer, createAudioResource, getVoiceConnection } from '@discordjs/voice'
import { asyncForEach } from '../utilities/array'
import { createLogger } from '../utilities/logger'

const playSoundLogger = createLogger('playSound')

export const playSound = (
  guildId: string | null,
  audioUrl: string | string[]
): Promise<void> => new Promise((resolve, reject) => {
  if (fp.isNil(audioUrl) || fp.isEmpty(audioUrl) || !guildId) {
    return resolve()
  }

  if (typeof audioUrl === 'string') {
    const connection = getVoiceConnection(guildId)
    const player = createAudioPlayer()
    const resource = createAudioResource(audioUrl)

    player.on('error', (err) => {
      playSoundLogger.error(err)
      reject(err)
    })

    player.on('stateChange', (oldState, newState) => {
      playSoundLogger.debug(`voice player stateChange '${oldState.status}' -> '${newState.status}'`)

      if (['idle', 'autopaused'].includes(newState.status)) {
        player.removeAllListeners()
        resolve()
      }
    })

    player.play(resource)
    connection?.subscribe(player)
  } else if (Array.isArray(audioUrl)) {
    Promise.resolve(asyncForEach<string>(audioUrl, (s) => playSound(guildId, s)))
      .then(resolve)
  }
})
