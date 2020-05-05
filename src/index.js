import Discord from 'discord.js'

const client = new Discord.Client()

// trigger after logging in
client.once('ready', () => {
  console.log('Ready!')
})


client.on('message', message => {
  if (message.author.bot) return
  message.channel.send(message.content)
  console.log(message.content)
})

client.login(process.env.BOT_TOKEN)
