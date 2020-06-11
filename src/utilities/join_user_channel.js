export const joinUserChannel = async message => {
  if (message.member.voice.channel) {
    const connection = await message.member.voice.channel.join()
    return connection
  }
}

export default joinUserChannel
