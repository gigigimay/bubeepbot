import { getQuestions } from '../services/alien'
import { MessageActionRow, MessageButton, User } from 'discord.js'
import { CommandInteractionExecution, CommandExecution, Command, CommandParamType } from '../types'
import { getRandomInt } from '../utilities/number'
import { ApplicationCommandOptionType } from 'discord-api-types'
import { createLogger } from '../utilities/logger'
import { EMOJIS } from '../constants'

const logger = createLogger('alien.ts')

// TODO: 0 player
// TODO: too many friends
// TODO: crashed when have parallel games
// TODO: stop listening to button event after started

const TIMEOUT = 60000 // 1 min
const MIN_PLAYERS = 3
const MESSAGES = {
  RULES: '🎯 RULES\n' +
    '1. One of you is an 👽 alien!\n' +
    '2. Every one will got the exactly same set of question but the alien will got a bit different\n' +
    '3. Each of you can ask another player one question using the question number eg. "Mr.A, please answer question number 1."\n' +
    '4. After every one asked and answered, guess who is the alien\n' +
    'See all possible questions here: https://docs.google.com/spreadsheets/d/1FId-8RNEedkMRCSEh9-agXmNB47ZsI_tW4q4_PNjitA/edit?usp=sharing\n',
  HEADER: '👽 LET\'S FIND AN ALIEN 👽',
  INTRO: `(minimum players: ${MIN_PLAYERS})`
}

const execute: CommandExecution = ({ message, param }) => (
  message.channel.send('try /alien')
)

const buttonRow = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setCustomId('join')
      .setLabel('Join')
      .setEmoji(EMOJIS.PLEASEEEEE.id)
      .setStyle('SECONDARY'),
    new MessageButton()
      .setCustomId('start')
      .setLabel('Start')
      .setEmoji(EMOJIS.PLAY.id)
      .setStyle('SECONDARY'),
  )

const getPlayerCountMessage = (players: User[]) => {
  const cutes = Array(players.length).fill(EMOJIS.PLEASEEEEE.message).join(' ')
  return `Players joined: ${players.length ? cutes : '-'}`
}

const interactionExecute: CommandInteractionExecution = async (interaction) => {
  let headerText = ''
  if (interaction.options.getBoolean('see_rules')) {
    headerText += MESSAGES.RULES
  }
  headerText += MESSAGES.INTRO

  const players: User[] = []

  // send game intro
  await interaction.reply({ content: `${MESSAGES.HEADER}\n${headerText}\n${getPlayerCountMessage(players)}`, components: [buttonRow] })

  // wait for players to join and start
  let started = false
  const collector = interaction.channel?.createMessageComponentCollector({ filter: () => true, time: TIMEOUT })
  if (!collector) {
    return
  }

  collector.on('collect', async (i) => {
    if (i.customId === 'join') {
      const { user } = i
      if (!players.find((p) => p.id === user.id)) {
        players.push(user)
      }
      await i.update({ content: `${MESSAGES.HEADER}\n${headerText}\n${getPlayerCountMessage(players)}` })
      return
    }

    if (i.customId === 'start') {
      started = true
      // console.log('players', players)


      if (players.length < MIN_PLAYERS) {
        const sadText = players.length === 1 ? "You can't play this alone, find some friend." : 'Players not enough, find some friends.'
        await i.update({ content: `${MESSAGES.HEADER}\n${sadText} ${EMOJIS.PLEASEEEEE.message}`, components: [] })
        if (players.length === 1) {
          await i.channel?.send('https://media1.giphy.com/media/7mQbDHkoSsWl2/giphy.gif?cid=ecf05e475vw1gt3g5fqsvqjtnxe65kl8ps74os5fk8z5mdpj&rid=giphy.gif&ct=g')
        }
        return
      }

      // start game kong jing
      const alienIndex = getRandomInt(players.length - 1, 0)
      const alien = players[alienIndex]
      players.splice(alienIndex)

      const questions = await getQuestions(players.length)
      sendHumanQuestions(questions.human, players)
      sendAlienQuestions(alien, questions.alien)
      await i.update({ content: `${MESSAGES.HEADER}\nGame started! Please check your inbox.`, components: [] })
    }
  })

  collector.on('end', () => {
    if (!started) {
      interaction.channel?.send({ content: 'Timeout! :ghost:', components: [] })
    }
  })
}

const sendHumanQuestions = (questions: string[], players: User[]) => {
  players.forEach((p) => {
    p.send(`🙂🙂🙂 YOU ARE A HUMAN 🙂🙂🙂\n${createQuestionText(questions)}`)
  })
}

const sendAlienQuestions = (user: User, questions: string[]) => {
  user.send(`👽👽👽 YOU ARE AN ALIEN 👽👽👽\n${createQuestionText(questions)}`)
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
