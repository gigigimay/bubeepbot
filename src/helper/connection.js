import fp from 'lodash/fp'
import { asyncForEach } from '../utilities/array'

// eslint-disable-next-line import/prefer-default-export
export const playSound = (connection, sound) => new Promise(resolve => {
  if (fp.isNil(sound) || fp.isEmpty(sound)) resolve()
  if (typeof sound === 'string') {
    const dispatcher = connection.play(sound)
    dispatcher.on('finish', resolve)
  } else if (Array.isArray(sound)) {
    Promise.resolve(asyncForEach(sound, s => playSound(connection, s)))
      .then(resolve)
  }
})
