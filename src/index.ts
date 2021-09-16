import { Client, Intents, Message } from 'discord.js'
import { joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice'
import { parseCommand } from './utilities/string'
// import handler from './handler'
// import { init as initCommands } from './helper/command'
import { refreshGuildCommands } from './helper/guild'
import { createLogger } from './utilities/logger'
import { handleCommandInteraction } from './handler/interaction'

const logger = createLogger('index.ts')

// FIXME
const slashCommands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'beep',
    description: 'Beep beep 01!',
  },
]

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
})

// initCommands()

// trigger once after logging in
client.once('ready', () => {
  logger.info(`[${client.user?.tag}] ready to comply.`)
})

client.on('interactionCreate', (interaction) => {
  if (!interaction.isCommand()) { return }
  handleCommandInteraction(interaction)
})

// // subscribe to message event
client.on('messageCreate', async (message) => {
  console.log('message >>>', message.member?.voice.channelId)
  console.log('message >>>', message.member?.fetch())

  // FIXME move to message command
  if (message.content === 'refresh') {
    if (message.guildId) {
      await refreshGuildCommands(message.guildId, slashCommands)
      message.reply('refreshing command done!')
    }
  }

  // FIXME buggy: cannot change channel
  if (message.content === 'join') {
    const member = await message.member?.fetch()
    const channelId = member?.voice.channelId
    const guildId = message.guildId
    const adapterCreator = message.guild?.voiceAdapterCreator
    console.log('joinVoiceConfig >>>', {
      member,
      channelId,
      guildId,
      adapterCreator,
    })
    if (channelId && guildId && adapterCreator) {
      logger.info('WILL JOIN~')
      const connection = joinVoiceChannel({
        channelId,
        guildId,
        adapterCreator,
      })
      // setTimeout(() => {
      //   logger.info('Leaving voice channel.. (A)')
      //   connection.destroy()
      // }, 5000)
      // connection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
      //   logger.info('Voice connection is in the Ready state!')
      //   setTimeout(() => {
      //     logger.info('Leaving voice channel.. (B)')
      //     connection.destroy()
      //   }, 3000)
      // })
      connection.on(VoiceConnectionStatus.Disconnected, () => {
        logger.info('VoiceConnectionStatus.Disconnected')
      })
      connection.on(VoiceConnectionStatus.Signalling, () => {
        logger.info('VoiceConnectionStatus.Signalling')
      })
      connection.on(VoiceConnectionStatus.Connecting, () => {
        logger.info('VoiceConnectionStatus.Connecting')
      })
      connection.on(VoiceConnectionStatus.Destroyed, () => {
        logger.info('VoiceConnectionStatus.Destroyed')
      })
      connection.on('stateChange', (oldState, newState) => {
        console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
      });
      connection.on('error', (err) => {
        logger.error(`connection error`, err)
      });

    } else {
      logger.info('NOT IN A VOICE CHANNEL!')
    }
  }

  // if (message.author.bot) return
  // const parsed = parseCommand(message.content)
  // if (parsed) {
  //   handler(parsed, message)
  // }
})

client.on('error', (error) => {
  logger.error(error)
})

client.login(process.env.BOT_TOKEN)
