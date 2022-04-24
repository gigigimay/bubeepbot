import { InteractionReplyOptions, Message, MessageActionRow, MessageButton, User } from 'discord.js'
import { ApplicationCommandOptionType } from 'discord-api-types'
import { CommandInteractionExecution, CommandExecution, Command, CommandParamType } from '../types'
import { getQuestions } from '../services/alien'
import { getRandomInt } from '../utilities/number'
import { createLogger } from '../utilities/logger'
import { EMOJIS } from '../constants'

const logger = createLogger('alien.ts')

const TIMEOUT = 10000 // 1 min
const MIN_PLAYERS = 1
const MESSAGES = {
  RULES: [
    '🎯 RULES',
    '1. Among all the 🙂human players, one of you is the 👽alien!',
    '2. Everyone will get the exactly same sets of questions but the alien will get a bit different',
    '3. Each of you can ask another player one question using the question number eg. "Mr.A, please answer question number 1."',
    '4. After every one asked and answered, guess who is the alien',
    'See all possible questions here: https://docs.google.com/spreadsheets/d/1FId-8RNEedkMRCSEh9-agXmNB47ZsI_tW4q4_PNjitA/edit?usp=sharing'
  ].join('\n'),
  HEADER: "👽 LET\'S FIND THE ALIEN 👽",
  INTRO: `(minimum players: ${MIN_PLAYERS})`
}

const execute: CommandExecution = ({ message }) => (
  message.channel.send('try /alien')
)

const interactionExecute: CommandInteractionExecution = async (interaction) => {
  const players: User[] = []
  const withRules = interaction.options.getBoolean('see_rules')
  let isStarted = false

  // send game introduction and menu
  const message = await interaction.reply(getGameInterface(players, withRules)) as unknown as Message
  const gameId = message.id
  logger.info(`[gameId: ${gameId}] game created`)

  const collector = message.createMessageComponentCollector({ filter: () => true, time: TIMEOUT })

  // wait for players to join and start
  collector.on('collect', async (i) => {
    // handle join game
    if (i.customId === 'join') {
      logger.info(`[gameId: ${gameId}] player joined`)
      const { user } = i
      if (!players.find((p) => p.id === user.id)) {
        players.push(user)
        await i.update(getGameInterface(players, withRules))
      } else {
        await i.reply({ content: 'You already joined this room!', ephemeral: true })
      }
      return
    }

    // handle start game
    if (i.customId === 'start') {
      isStarted = true

      if (players.length < MIN_PLAYERS) {
        logger.info(`[gameId: ${gameId}] players not enough`)
        const sadText = players.length === 1 ? "You can't play this alone, find some friend." : 'Players not enough, find some friends.'
        await i.update({ content: `${MESSAGES.HEADER}\n${sadText} :smiling_face_with_tear:`, components: [] })
        if (players.length === 1) {
          await i.channel?.send('https://media1.giphy.com/media/7mQbDHkoSsWl2/giphy.gif?cid=ecf05e475vw1gt3g5fqsvqjtnxe65kl8ps74os5fk8z5mdpj&rid=giphy.gif&ct=g')
        }
        return
      }

      // start game kong jing
      logger.info(`[gameId: ${gameId}] started`)
      await i.update({ content: `${MESSAGES.HEADER}\nGame started! Please wait and check your inbox.`, components: [] })
      const alienIndex = getRandomInt(players.length - 1, 0)
      const alien = players[alienIndex]
      players.splice(alienIndex)

      const questions = await getQuestions(players.length)
      await sendHumanQuestions(questions.human, players)
      await sendAlienQuestions(questions.alien, alien)
      return
    }
  })

  collector.on('end', () => {
    if (!isStarted) {
      logger.info(`[gameId: ${gameId}] timeout`)
      interaction.editReply({ content: `${MESSAGES.HEADER}\nTimeout! The game wasn't started. :ghost:`, components: [] })
    }
  })
}

const getGameInterface = (players: User[], withRules: boolean | null): InteractionReplyOptions => {
  const messages = [MESSAGES.HEADER]
  if (withRules) {
    messages.push(MESSAGES.RULES)
  }
  messages.push(`(${MIN_PLAYERS}+ players to start)`)
  messages.push(getPlayerCountMessage(players))
  return {
    content: messages.join('\n'),
    components: getGameMenuComponents(players),
    fetchReply: true,
  }
}

const getGameMenuComponents = (players: User[]) => {
  const row = new MessageActionRow()
  row.addComponents(
    new MessageButton()
      .setCustomId('join')
      .setLabel('Join')
      .setEmoji(EMOJIS.PLEASEEEEE.id)
      .setStyle('SECONDARY'),
    new MessageButton()
      .setCustomId('start')
      .setLabel('Start')
      .setEmoji(EMOJIS.PLAY.id)
      .setStyle('SECONDARY')
      .setDisabled(players.length < MIN_PLAYERS),
  )
  return [row]
}

const getPlayerCountMessage = (players: User[]) => {
  const cutes = Array(players.length).fill(EMOJIS.PLEASEEEEE.message).join(' ')
  return `Players joined: ${players.length ? cutes : '-'}`
}

const sendHumanQuestions = (questions: string[], players: User[]) => {
  return Promise.all(players.map((p) => p.send(`🙂🙂🙂 YOU ARE A HUMAN 🙂🙂🙂\n${createQuestionText(questions)}`)))
}

const sendAlienQuestions = (questions: string[], user: User) => {
  return user.send(`👽👽👽 YOU ARE AN ALIEN 👽👽👽\n${createQuestionText(questions)}`)
}

const createQuestionText = (questions: string[]) => {
  return questions.map((question, index) => `${index + 1}. ${question}`).join('\n')
}

const command: Command = {
  name: 'alien',
  desc: 'Find the alien!',
  param: CommandParamType.Optional,
  options: [
    {
      name: 'see_rules',
      description: 'Do you want to see play rules?',
      type: ApplicationCommandOptionType.Boolean,
      isRequired: false
    }
  ],
  execute,
  interactionExecute,
}

export default command
