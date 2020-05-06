/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { withStar } from '../utilities/string'
import { sendError } from '../utilities/message'
import handleCooldown from './cooldown'
import getCommand from './getCommand'

export default ({ name, param }, message) => {
  const command = getCommand(name, message)

  // handle unknown commands
  if (!command) {
    return message.channel.send(`${withStar('BUBEEP')} Did you cast a wrong spell? :face_with_raised_eyebrow:`)
  }

  if (!handleCooldown(message, command)) return

  // execute command
  try {
    command.execute(message, param)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e.message)
    sendError(e, message, `${withStar('BUBEEP')} Mr.Stark, I don't feel so good. :nauseated_face:`)
  }
}
