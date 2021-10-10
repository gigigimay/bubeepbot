import { Client, Intents } from 'discord.js'
import { getVoiceConnection, joinVoiceChannel, VoiceConnectionStatus, createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice'
import { parseCommand } from './utilities/string'
import handler from './handler'
import { getSlashCommands, init as initCommands } from './helper/command'
import { refreshGuildCommands } from './helper/guild'
import { createLogger } from './utilities/logger'
import { handleCommandInteraction } from './handler/interaction'

const logger = createLogger('index.ts')

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
})

initCommands()
const slashCommands = getSlashCommands()

// trigger once after logging in
client.once('ready', () => {
  logger.info(`[${client.user?.tag}] ready to comply.`)
})

client.on('interactionCreate', (interaction) => {
  if (!interaction.isCommand()) { return }
  handleCommandInteraction(interaction)
})

// // subscribe to message event
client.on('messageCreate', (message) => {
  // FIXME move to message command
  if (message.content === 'refresh') {
    if (message.guildId) {
      refreshGuildCommands(message.guildId, slashCommands)
      message.reply('refreshing command done!')
      return
    }
  }

  if (message.content === 'list') {
    message.guild?.channels.fetch().then((channels) => {
      channels.forEach((channel) => {
        console.log('\nlist: channel type >>>', channel.type)
        console.log('list: channel id >>>', channel.id)
        console.log('list: channel name >>>', channel.name)
      })
    })
  }

  if (message.content === 'play' && message.guildId !== null) {
    const connection = getVoiceConnection(message.guildId)
    if (connection) {
      console.log(connection)
      const player = createAudioPlayer()
      const resource = createAudioResource('https://translate.google.com.vn/translate_tts?ie=UTF-8&q=36&tl=th&client=tw-ob')

      player.play(resource)

      connection.subscribe(player)

      connection.on('stateChange', (oldState, newState) => {
        console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`)
      })
    }
  }

  // console.log('message >>>', message.guildId)
  // if (message.content === 'leave' && message.guildId !== null) {
  //   const connection = getVoiceConnection(message.guildId)
  //   connection?.destroy()
  // }

  // FIXME buggy: cannot change channel
  if (message.content === 'join') {
    const member = message.member
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
        console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`)
      })
      connection.on('error', (err) => {
        logger.error('connection error', err)
      })
    } else {
      logger.info('NOT IN A VOICE CHANNEL!')
    }
  }

  if (message.author.bot) return
  const parsed = parseCommand(message.content)
  if (parsed) {
    handler(parsed, message)
  }
})

client.on('error', (error) => {
  logger.error(error)
})

client.login(process.env.BOT_TOKEN)
