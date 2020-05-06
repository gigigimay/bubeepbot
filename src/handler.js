import { withStar } from './utilities/string'
import commands from './commands'

export default ({ name, param }, message) => {
  const handler = commands[name]
  if (handler) {
    handler({ name, param }, message)
  } else {
    message.channel.send(`Unknown bubeep command. ${withStar('beep')}`)
  }
}
