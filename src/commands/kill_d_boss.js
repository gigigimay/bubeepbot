import { exampleCommand, beep } from '../utilities/string'

import { joinUserChannel } from '../utilities/join_user_channel'
import { getUserInVoiceChannel } from '../utilities/get_user_in_channel'

// TODO: join room > tell role > send each role info with DM > open vote used emoji > tell result

const error = [
  beep('You need at least 5 member to play'),
]

const openVote = () => {}
const sendResult = () => {}

const execute = async message => {
  // const connection = await joinUserChannel(message)
  // const playerList = connection.channel.members.map(member => member.user)
  // console.log(playerList)

  const playerList = ['a', 'b', 'c', 'd', 'e', 'bot']

  const roles = {
    mafiaBoss: null,
    mafia: null,
    seer: null,
    percival: null,
    tanner: null,
    leader: null,
  }

  if (playerList.length - 1 < 5) {
    message.channel.send(error)
  } else {
  // TODO: send message: each role power
    console.log(roles)
  }
}

export default {
  name: 'kdb',
  desc: 'Find Da Boss',
  param: 0, // 0: no param, 1: optional, 2: required
  execute,
}
