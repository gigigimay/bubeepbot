import { getNotDuplicatedRandomNumbers } from './../utilities/number'
import { tryReadSheet } from './../helper/google_sheet'
import { Message, MessageReaction, ReactionCollector, ReactionEmoji, ReactionUserManager, User } from 'discord.js'
import { CommandInteractionExecution, CommandExecution, Command, CommandParamType } from '../types'
import { getRandomInt } from '../utilities/number'
import { sheets_v4 } from 'googleapis'

let players: User[] = []
let alien: User | null = null

const execute: CommandExecution = ({ message, param }) => (
  message.channel.send('try /alien')
)

const interactionExecute: CommandInteractionExecution = async (interaction) => {
  let content = ''
  if (interaction.options.getBoolean('see_rules')) {
    content += '🎯 RULES\n' +
      '1. One of you is an alien\n' +
      '2. Every one will got the exactly same set of question but alien will got a bit different\n' +
      '3. Each of you can ask another player one question using the question number eg. "Mr.A, please answer question number 1."\n' +
      '4. After every one asked and answered, guess who is the alien\n'
  }
  content += '👽 LET\'S FIND AN ALIEN 👽\nplease wait until ▶️ ready to react before join\n🖐 to join & ▶️ to start'

  const message = await interaction.reply({
    content: content, fetchReply: true
  }) as Message
  message.react('🖐')
    .then(() => message.react('▶️'))
    .then(() => waitForNextReaction(message))
    .catch(error => console.error('One of the emojis failed to react:', error))
}

const filter = (reaction: MessageReaction) => {
  return ['🖐', '▶️'].includes(reaction.emoji.name ?? '')
}

const waitForNextReaction = (message: Message) => {
  message.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'], })
    .then(async collected => {
      const reaction = collected.first()
      if (reaction?.emoji.name === '🖐') {
        reaction.users.fetch().then((users) => {
          players = Array.from(users.values()).filter((p) => !p.bot)
        })
      }
      else if (reaction?.emoji.name === '▶️') {
        const alienIndex = getRandomInt(players.length - 1, 0)
        alien = players[alienIndex]
        players.splice(alienIndex)

        tryReadSheet(sendQuestions)
      }

      waitForNextReaction(message)
    })
    .catch(collected => {
      message.reply('Timeout!!, this message will be expired.')
    })
}

const sendQuestions = async (sheets: sheets_v4.Sheets) => {
  sheets.spreadsheets.values.get({
    spreadsheetId: '1FId-8RNEedkMRCSEh9-agXmNB47ZsI_tW4q4_PNjitA',
    range: 'alien_q_db',
  }, (err: any, res: any) => {
    if (err) return console.log('The API returned an error: ' + err)
    const [humanQuestions, alienQuestions] = createQuestions(res.data.values)

    sendHumanQuestions(humanQuestions)
    sendAlienQuestions(alien!, alienQuestions)
  })
}

const createQuestions = (data: [][]): [string[], string[]] => {
  if (data.length) {
    let humanQuestions: string[] = []
    let alienQuestions: string[] = []
    const rowSize: number = data.length // use max row available
    const rowNumbers = getNotDuplicatedRandomNumbers(rowSize)(players.length + 1)
    rowNumbers.forEach((rowNumber) => {
      const columnSize = data[rowNumber].length // use max column available
      const columnNumbers = getNotDuplicatedRandomNumbers(columnSize)(2)
      humanQuestions.push(data[rowNumber][columnNumbers[0]])
      alienQuestions.push(data[rowNumber][columnNumbers[1]])
    })

    return [humanQuestions, alienQuestions]
  } else {
    console.log('No data found.')
    return [[], []]
  }
}

const sendHumanQuestions = (questions: string[]) => {
  players.forEach((p) => {
    p.send(`🙂🙂🙂 YOU ARE A HUMAN 🙂🙂🙂\n${createQuestionText(questions)}`)
  })
}
const sendAlienQuestions = (user: User, questions: string[]) => {
  user.send(`👽👽👽 YOU ARE AN ALIEN 👽👽👽\n${createQuestionText(questions)}`)
}

const createQuestionText = (questions: string[]) => {
  let text = ''
  questions.forEach((question, index) => {
    text += `${index + 1}. ${question}\n`
  })
  return text
}

const command: Command = {
  name: 'alien',
  desc: 'Find the alien!',
  param: CommandParamType.Optional,
  options: [
    {
      name: 'see_rules',
      description: 'Do you want to see play rules?',
      type: 5,
      isRequired: false
    }
  ],
  execute,
  interactionExecute,
}

export default command
