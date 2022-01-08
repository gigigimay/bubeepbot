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
  const message = await interaction.reply({ content: '👽 FIND AN ALIEN 👽\n 🖐 to join & ▶️ to start', fetchReply: true }) as Message
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
    range: 'A1:C10',
  }, (err: any, res: any) => {
    if (err) return console.log('The API returned an error: ' + err)
    const [humanQuestions, alienQuestions] = createQuestions(res.data.values)

    sendHumanQuestions(humanQuestions)
    sendAlienQuestions(alien!, alienQuestions)
  })
}

const createQuestions = (data: []): [string[], string[]] => {
  if (data.length) {
    let humanQuestions: string[] = []
    let alienQuestions: string[] = []
    const rowSize: number = 10 // use max row available
    const rowNumbers = getNotDuplicatedRandomNumbers(rowSize)(players.length + 1)
    rowNumbers.forEach((rowNumber) => {
      const columnSize = 2 // use max column available
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
  desc: 'find the alien',
  param: CommandParamType.None,
  execute,
  interactionExecute,
}

export default command
