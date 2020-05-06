import { prefix } from '../../config.json'

const error = [
  'ERROR: You need to tell Bubeep what to *echo*.',
  `:speech_balloon: ${prefix}echo hello`,
]

export default ({ param }, message) => {
  message.channel.send(param || error)
}
